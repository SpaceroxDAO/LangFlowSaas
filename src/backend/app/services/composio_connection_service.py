"""
Composio Connection Service - manages OAuth connections to external apps.

This service handles:
- Initiating OAuth flows via Composio
- Tracking connection status
- Retrieving tools for connected apps
- User isolation via entity_id mapping
"""
import logging
import uuid
from datetime import datetime
from typing import List, Optional, Tuple, Any

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User
from app.models.user_connection import UserConnection
from app.schemas.connection import (
    ConnectionInitiateRequest,
    ConnectionInitiateResponse,
    ConnectionResponse,
    ComposioAppInfo,
    ComposioAppsResponse,
    ConnectionToolInfo,
    ConnectionToolsResponse,
    ConnectionStatusResponse,
    COMPOSIO_APPS,
)

logger = logging.getLogger(__name__)


class ComposioConnectionServiceError(Exception):
    """Exception raised when Composio operations fail."""
    pass


class ComposioConnectionService:
    """Service for managing Composio OAuth connections."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self._composio_client = None

    def _get_composio_client(self):
        """Get or create Composio client (lazy initialization)."""
        if self._composio_client is None:
            if not settings.composio_api_key:
                raise ComposioConnectionServiceError(
                    "Composio API key not configured. Set COMPOSIO_API_KEY in environment."
                )

            try:
                from composio import Composio
                self._composio_client = Composio(api_key=settings.composio_api_key)
            except ImportError:
                raise ComposioConnectionServiceError(
                    "Composio SDK not installed. Run: pip install composio-core composio-langchain"
                )
            except Exception as e:
                raise ComposioConnectionServiceError(f"Failed to initialize Composio client: {e}")

        return self._composio_client

    def _get_entity_id(self, user: User) -> str:
        """
        Get Composio entity_id for a user.

        MULTI-TENANT ISOLATION: Each user gets their own entity_id.

        How it works:
        - OAuth connections are stored in Composio under user's ID as entity_id
        - When executing tools, we pass user_id via Langflow tweaks
        - Tweaks override the component's default entity_id at runtime
        - This ensures each user's tools access only their own OAuth tokens

        Canvas testing:
        - Components default to entity_id="default" for canvas playground testing
        - Production chat endpoints inject the real user ID via tweaks
        """
        return str(user.id)

    def _get_or_create_auth_config(self, app_name: str) -> str:
        """
        Get or create a Composio auth config for an app.

        Uses Composio-managed auth (Composio's OAuth credentials) to simplify setup.
        Returns the auth_config_id needed for initiating connections.

        Note: Composio SDK v0.10+ uses auth_configs instead of integrations.
        """
        composio = self._get_composio_client()

        try:
            # First check if we already have an auth config for this app
            existing_configs = composio.auth_configs.list()
            if hasattr(existing_configs, 'items'):
                for config in existing_configs.items:
                    # Check if this config is for our app (toolkit)
                    if hasattr(config, 'toolkit') and hasattr(config.toolkit, 'slug'):
                        if config.toolkit.slug == app_name:
                            logger.info(f"Found existing auth config for {app_name}: {config.id}")
                            return config.id

            # No existing auth config, create a new one using Composio's managed auth
            import time
            config = composio.auth_configs.create(
                toolkit=app_name,
                options={
                    'name': f'auth_config_{app_name}_{int(time.time()*1000)}',
                    'type': 'use_composio_managed_auth'
                }
            )

            logger.info(f"Created new auth config for {app_name}: {config.id}")
            return config.id

        except ComposioConnectionServiceError:
            raise
        except Exception as e:
            logger.error(f"Failed to get/create auth config for {app_name}: {e}")
            raise ComposioConnectionServiceError(
                f"Failed to get/create auth config for {app_name}: {e}"
            )

    async def initiate_connection(
        self,
        user: User,
        data: ConnectionInitiateRequest,
    ) -> ConnectionInitiateResponse:
        """
        Start OAuth flow for connecting an app.

        Creates a pending connection record and returns the OAuth URL.
        """
        app_name = data.app_name.lower()

        # Validate app is supported
        if app_name not in COMPOSIO_APPS:
            raise ComposioConnectionServiceError(
                f"App '{app_name}' is not supported. Available apps: {list(COMPOSIO_APPS.keys())}"
            )

        entity_id = self._get_entity_id(user)
        callback_url = data.redirect_url or settings.composio_callback_url

        try:
            composio = self._get_composio_client()

            # Get or create auth config for this app (SDK v0.10+)
            auth_config_id = self._get_or_create_auth_config(app_name)
            logger.info(f"Using auth config {auth_config_id} for {app_name}")

            # Initiate connection with Composio (SDK v0.10+ API)
            connection_request = composio.connected_accounts.initiate(
                user_id=entity_id,
                auth_config_id=auth_config_id,
                callback_url=callback_url,
            )

            # Extract the connection ID and redirect URL from the response
            composio_conn_id = connection_request.id if hasattr(connection_request, 'id') else str(connection_request)
            redirect_url_response = connection_request.redirect_url if hasattr(connection_request, 'redirect_url') else None

            if not redirect_url_response:
                raise ComposioConnectionServiceError(
                    f"No redirect URL returned from Composio for {app_name}"
                )

            # Create pending connection record in our database
            connection = UserConnection(
                user_id=str(user.id),
                app_name=app_name,
                app_display_name=COMPOSIO_APPS[app_name]["display_name"],
                composio_connection_id=composio_conn_id,
                composio_entity_id=entity_id,
                status="pending",
            )

            self.session.add(connection)
            await self.session.flush()
            await self.session.refresh(connection)

            logger.info(
                f"Initiated connection for user {user.id} to {app_name} "
                f"(composio_id={composio_conn_id})"
            )

            return ConnectionInitiateResponse(
                connection_id=connection.id,
                composio_connection_id=composio_conn_id,
                redirect_url=redirect_url_response,
                expires_in=600,  # 10 minutes
            )

        except ComposioConnectionServiceError:
            raise
        except Exception as e:
            logger.error(f"Failed to initiate connection: {e}")
            raise ComposioConnectionServiceError(f"Failed to initiate connection: {e}")

    async def handle_callback(
        self,
        user: User,
        connection_id: uuid.UUID,
    ) -> ConnectionResponse:
        """
        Handle OAuth callback and finalize connection.

        Called after user returns from OAuth provider.
        """
        # Get pending connection
        connection = await self.get_by_id(connection_id, user.id)
        if not connection:
            raise ComposioConnectionServiceError("Connection not found")

        if connection.status != "pending":
            logger.warning(f"Callback for non-pending connection {connection_id}: {connection.status}")
            # Return current state instead of erroring
            return ConnectionResponse.model_validate(connection)

        try:
            composio = self._get_composio_client()

            # Get the connection status from Composio (SDK v0.10+ uses nanoid)
            try:
                connected_account = composio.connected_accounts.get(
                    nanoid=connection.composio_connection_id
                )

                # Check status
                status = getattr(connected_account, 'status', None)
                if status and status.upper() == 'ACTIVE':
                    connection.status = "active"
                    connection.connected_at = datetime.utcnow()

                    # Try to get account identifier (email, username, etc.)
                    if hasattr(connected_account, 'connectionParams'):
                        params = connected_account.connectionParams
                        if isinstance(params, dict):
                            connection.account_identifier = (
                                params.get('email') or
                                params.get('user_email') or
                                params.get('username') or
                                params.get('display_name')
                            )

                    # Get available actions for this app
                    connection.available_actions = self._get_app_actions(connection.app_name)

                    logger.info(
                        f"Connection completed for user {user.id} to {connection.app_name} "
                        f"(account={connection.account_identifier})"
                    )
                elif status and status.upper() in ('FAILED', 'EXPIRED'):
                    connection.status = "error"
                    connection.last_error = f"Connection {status.lower()}. Please try again."
                else:
                    # Still pending
                    logger.info(f"Connection {connection_id} still pending: {status}")

            except Exception as e:
                # Could not fetch - mark as active optimistically (user completed OAuth)
                connection.status = "active"
                connection.connected_at = datetime.utcnow()
                connection.available_actions = self._get_app_actions(connection.app_name)
                logger.warning(f"Could not verify connection, marking active: {e}")

        except Exception as e:
            connection.status = "error"
            connection.last_error = str(e)
            logger.error(f"Connection callback failed: {e}")

        await self.session.flush()
        await self.session.refresh(connection)

        return ConnectionResponse.model_validate(connection)

    async def handle_callback_by_composio_id(
        self,
        user: User,
        composio_connection_id: str,
        app_name: Optional[str] = None,
    ) -> ConnectionResponse:
        """
        Handle OAuth callback using Composio's connection ID.

        This is used when Composio returns connectedAccountId in the callback URL
        instead of our internal connection_id.
        """
        # Find the pending connection by Composio connection ID
        connection = await self.get_by_composio_id(composio_connection_id, user.id)

        if not connection:
            # Try to find by app name if provided (fallback for most recent pending)
            if app_name:
                connection = await self.get_pending_by_app(app_name, user.id)

        if not connection:
            raise ComposioConnectionServiceError(
                f"Connection not found for composio_id={composio_connection_id}"
            )

        # Update the composio_connection_id if it changed (Composio may return a different ID)
        if connection.composio_connection_id != composio_connection_id:
            logger.info(
                f"Updating composio_connection_id from {connection.composio_connection_id} "
                f"to {composio_connection_id}"
            )
            connection.composio_connection_id = composio_connection_id

        # Use the existing handle_callback logic
        return await self.handle_callback(user=user, connection_id=uuid.UUID(str(connection.id)))

    async def get_by_composio_id(
        self,
        composio_connection_id: str,
        user_id: uuid.UUID,
    ) -> Optional[UserConnection]:
        """Get connection by Composio's connection ID."""
        stmt = select(UserConnection).where(
            UserConnection.composio_connection_id == composio_connection_id,
            UserConnection.user_id == str(user_id),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_pending_by_app(
        self,
        app_name: str,
        user_id: uuid.UUID,
    ) -> Optional[UserConnection]:
        """Get the most recent pending connection for an app."""
        stmt = (
            select(UserConnection)
            .where(
                UserConnection.app_name == app_name,
                UserConnection.user_id == str(user_id),
                UserConnection.status == "pending",
            )
            .order_by(UserConnection.created_at.desc())
            .limit(1)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(
        self,
        connection_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Optional[UserConnection]:
        """Get connection by ID, filtered by user for security."""
        stmt = select(UserConnection).where(
            UserConnection.id == str(connection_id),
            UserConnection.user_id == str(user_id),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = False,
    ) -> Tuple[List[UserConnection], int]:
        """List all connections for a user with pagination."""
        stmt = select(UserConnection).where(
            UserConnection.user_id == str(user_id)
        )

        if active_only:
            stmt = stmt.where(UserConnection.status == "active")

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(UserConnection.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        connections = list(result.scalars().all())

        return connections, total

    async def get_active_connections(
        self,
        user_id: uuid.UUID,
    ) -> List[UserConnection]:
        """Get all active connections for a user."""
        stmt = select(UserConnection).where(
            UserConnection.user_id == str(user_id),
            UserConnection.status == "active",
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def revoke_connection(
        self,
        user: User,
        connection_id: uuid.UUID,
    ) -> bool:
        """Revoke/disconnect an app connection."""
        connection = await self.get_by_id(connection_id, user.id)
        if not connection:
            raise ComposioConnectionServiceError("Connection not found")

        try:
            # Delete from Composio (optional - they may not support this)
            try:
                composio = self._get_composio_client()
                # Note: Composio may not have a direct revoke API
                # We'll mark as revoked locally
            except Exception as e:
                logger.warning(f"Could not revoke in Composio: {e}")

            # Mark as revoked in our database
            connection.status = "revoked"
            await self.session.flush()

            logger.info(f"Revoked connection {connection_id} for user {user.id}")
            return True

        except ComposioConnectionServiceError:
            raise
        except Exception as e:
            logger.error(f"Failed to revoke connection: {e}")
            raise ComposioConnectionServiceError(f"Failed to revoke connection: {e}")

    async def delete_connection(
        self,
        user: User,
        connection_id: uuid.UUID,
    ) -> bool:
        """Delete a connection record."""
        connection = await self.get_by_id(connection_id, user.id)
        if not connection:
            raise ComposioConnectionServiceError("Connection not found")

        await self.session.delete(connection)
        await self.session.flush()

        logger.info(f"Deleted connection {connection_id} for user {user.id}")
        return True

    async def check_connection_status(
        self,
        user: User,
        connection_id: uuid.UUID,
    ) -> ConnectionStatusResponse:
        """Check the current status of a connection."""
        connection = await self.get_by_id(connection_id, user.id)
        if not connection:
            raise ComposioConnectionServiceError("Connection not found")

        # Optionally refresh status from Composio
        # For now, return cached status
        return ConnectionStatusResponse(
            id=connection.id,
            app_name=connection.app_name,
            status=connection.status,
            is_active=connection.is_active,
            needs_reconnection=connection.needs_reconnection,
            last_error=connection.last_error,
        )

    async def get_available_apps(
        self,
        user: User,
    ) -> ComposioAppsResponse:
        """Get list of available apps with connection status."""
        # Get user's existing connections
        connections = await self.get_active_connections(user.id)
        connected_apps = {c.app_name: c for c in connections}

        apps = []
        categories = set()

        for app_name, app_info in COMPOSIO_APPS.items():
            connection = connected_apps.get(app_name)
            apps.append(ComposioAppInfo(
                app_name=app_name,
                display_name=app_info["display_name"],
                description=app_info["description"],
                icon=app_info["icon"],
                category=app_info["category"],
                actions=app_info["actions"],
                is_connected=connection is not None,
                connection_id=connection.id if connection else None,
                connection_status=connection.status if connection else None,
            ))
            categories.add(app_info["category"])

        return ComposioAppsResponse(
            apps=sorted(apps, key=lambda x: (not x.is_connected, x.display_name)),
            categories=sorted(list(categories)),
        )

    async def get_tools_for_user(
        self,
        user: User,
        app_names: Optional[List[str]] = None,
    ) -> ConnectionToolsResponse:
        """
        Get Composio tools for a user's connected apps.

        This is the key method for workflow integration - it returns
        LangChain-compatible tools for all connected apps.
        """
        connections = await self.get_active_connections(user.id)

        if not connections:
            return ConnectionToolsResponse(tools=[], total=0)

        # Filter by requested apps if specified
        if app_names:
            connections = [c for c in connections if c.app_name in app_names]

        tools = []
        for connection in connections:
            # Get actions for this app
            app_actions = self._get_app_actions(connection.app_name)
            for action in app_actions:
                tools.append(ConnectionToolInfo(
                    name=action["name"],
                    description=action.get("description", ""),
                    app_name=connection.app_name,
                    parameters=action.get("parameters"),
                ))

        return ConnectionToolsResponse(tools=tools, total=len(tools))

    def get_langchain_tools(
        self,
        user: User,
        app_names: Optional[List[str]] = None,
    ) -> List[Any]:
        """
        Get LangChain-compatible tools for workflow execution.

        This method is called during workflow chat to inject Composio tools.
        Returns actual LangChain tool objects.
        """
        if not settings.composio_api_key:
            logger.warning("Composio not configured - returning no tools")
            return []

        try:
            from composio_langchain import ComposioToolSet

            entity_id = self._get_entity_id(user)
            toolset = ComposioToolSet(api_key=settings.composio_api_key)

            # Get tools for specified apps or all connected apps
            if app_names:
                tools = toolset.get_tools(
                    entity_id=entity_id,
                    apps=app_names,
                )
            else:
                # Get all available tools for user
                tools = toolset.get_tools(entity_id=entity_id)

            logger.info(f"Retrieved {len(tools)} Composio tools for user {user.id}")
            return tools

        except ImportError:
            logger.warning("composio-langchain not installed")
            return []
        except Exception as e:
            logger.error(f"Failed to get LangChain tools: {e}")
            return []

    def _get_app_actions(self, app_name: str) -> List[dict]:
        """Get available actions for an app."""
        app_info = COMPOSIO_APPS.get(app_name)
        if not app_info:
            return []

        return [
            {"name": action, "description": f"{app_info['display_name']} action"}
            for action in app_info.get("actions", [])
        ]

    async def update_last_used(
        self,
        connection_id: uuid.UUID,
    ) -> None:
        """Update the last_used_at timestamp for a connection."""
        connection = await self.session.get(UserConnection, str(connection_id))
        if connection:
            connection.last_used_at = datetime.utcnow()
            await self.session.flush()

    async def refresh_connection(
        self,
        user: User,
        connection_id: uuid.UUID,
    ) -> ConnectionResponse:
        """
        Attempt to refresh an expired connection.

        Composio handles token refresh automatically, but we may need
        to update our status if it expired.
        """
        connection = await self.get_by_id(connection_id, user.id)
        if not connection:
            raise ComposioConnectionServiceError("Connection not found")

        try:
            composio = self._get_composio_client()

            # Check connection status with Composio (SDK v0.10+ uses nanoid)
            connected_account = composio.connected_accounts.get(
                nanoid=connection.composio_connection_id
            )

            if connected_account and hasattr(connected_account, 'status'):
                if connected_account.status == 'ACTIVE':
                    connection.status = "active"
                    connection.last_error = None
                elif connected_account.status == 'EXPIRED':
                    connection.status = "expired"
                    connection.last_error = "Token expired. Please reconnect."

            await self.session.flush()
            await self.session.refresh(connection)

        except Exception as e:
            logger.warning(f"Could not refresh connection status: {e}")

        return ConnectionResponse.model_validate(connection)
