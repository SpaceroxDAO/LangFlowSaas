"""
Clerk JWT authentication middleware for FastAPI.
Uses PyJWT with JWKS validation for secure token verification.
"""
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated, Optional

import jwt
from jwt import PyJWKClient, PyJWKClientError
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings


@dataclass
class ClerkUser:
    """Authenticated Clerk user information extracted from JWT."""

    user_id: str  # Clerk user ID (sub claim)
    session_id: Optional[str]  # Clerk session ID (sid claim)
    email: Optional[str]  # Email if included in token
    authorized_party: Optional[str]  # Origin that generated token (azp claim)
    expires_at: Optional[int]  # Token expiration timestamp
    issued_at: Optional[int]  # Token issued timestamp
    organization: Optional[dict] = None  # Organization data if present
    raw_claims: Optional[dict] = None  # Full token payload for advanced use


# Development mode mock user - used when DEV_MODE=true
DEV_USER = ClerkUser(
    user_id="dev_user_123",
    session_id="dev_session",
    email="dev@teachcharlie.ai",
    authorized_party="http://localhost:5173",
    expires_at=None,
    issued_at=None,
    organization=None,
    raw_claims=None,
)


@lru_cache(maxsize=1)
def get_jwks_client() -> PyJWKClient:
    """
    Get a cached JWKS client.
    PyJWKClient internally caches keys for 5 minutes by default.
    """
    if not settings.clerk_jwks_url:
        raise ValueError(
            "CLERK_JWKS_URL not configured. "
            "Set it to https://your-instance.clerk.accounts.dev/.well-known/jwks.json"
        )

    return PyJWKClient(
        settings.clerk_jwks_url,
        cache_keys=True,
        lifespan=300,  # 5 minutes cache
    )


# Security scheme for extracting bearer token
security = HTTPBearer(auto_error=False)


def validate_clerk_token(token: str) -> dict:
    """
    Validate a Clerk JWT token and return the decoded payload.

    Args:
        token: The JWT token string

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token validation fails
    """
    if not settings.clerk_issuer:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clerk authentication not configured",
        )

    try:
        # Get the JWKS client
        jwks_client = get_jwks_client()

        # Get the signing key from the token header
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and verify the token
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.clerk_issuer,
            options={
                "verify_signature": True,
                "verify_exp": True,
                "verify_nbf": True,
                "verify_iat": True,
                "verify_iss": True,
                "require": ["exp", "iat", "sub"],
            },
            leeway=5,  # 5 seconds clock drift tolerance
        )

        # Validate authorized party (azp) claim if present and configured
        azp = payload.get("azp")
        authorized_parties = settings.authorized_parties_list

        if azp and authorized_parties:
            if azp not in authorized_parties:
                raise jwt.InvalidTokenError(f"Invalid authorized party: {azp}")

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token issuer.",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
    except PyJWKClientError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Authentication service unavailable: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> ClerkUser:
    """
    FastAPI dependency that validates Clerk JWT and returns user information.

    Usage:
        @app.get("/protected")
        async def protected_route(user: ClerkUser = Depends(get_current_user)):
            return {"user_id": user.user_id}
    """
    # Development mode - skip auth entirely and return mock user
    if settings.dev_mode:
        return DEV_USER

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = validate_clerk_token(token)

    return ClerkUser(
        user_id=payload.get("sub"),
        session_id=payload.get("sid"),
        email=payload.get("email"),
        authorized_party=payload.get("azp"),
        expires_at=payload.get("exp"),
        issued_at=payload.get("iat"),
        organization=payload.get("o"),
        raw_claims=payload,
    )


async def get_optional_user(
    request: Request,
) -> Optional[ClerkUser]:
    """
    Optional authentication - returns None if no token or invalid token.

    Usage:
        @app.get("/public")
        async def public_route(user: Optional[ClerkUser] = Depends(get_optional_user)):
            if user:
                return {"message": f"Hello, {user.user_id}"}
            return {"message": "Hello, anonymous"}
    """
    # Development mode - always return mock user
    if settings.dev_mode:
        return DEV_USER

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ", 1)[1]

    try:
        payload = validate_clerk_token(token)
        return ClerkUser(
            user_id=payload.get("sub"),
            session_id=payload.get("sid"),
            email=payload.get("email"),
            authorized_party=payload.get("azp"),
            expires_at=payload.get("exp"),
            issued_at=payload.get("iat"),
            organization=payload.get("o"),
            raw_claims=payload,
        )
    except HTTPException:
        return None


# Type alias for dependency injection
CurrentUser = Annotated[ClerkUser, Depends(get_current_user)]
OptionalUser = Annotated[Optional[ClerkUser], Depends(get_optional_user)]


def require_user(user: CurrentUser) -> ClerkUser:
    """
    Simple dependency that requires a user to be authenticated.
    Raises 401 if not authenticated.
    """
    return user
