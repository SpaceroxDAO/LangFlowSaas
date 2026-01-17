"""
Embed API endpoints for embeddable chat widget.

Provides public endpoints for embedding agents on external websites.
"""
import logging
import secrets
from typing import Optional, Dict, Any

from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel, Field

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.services.user_service import UserService
from app.services.agent_component_service import AgentComponentService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/embed", tags=["Embed"])


# =============================================================================
# Request/Response Models
# =============================================================================

class EmbedConfig(BaseModel):
    """Configuration for the embed widget."""

    theme: str = "light"  # light, dark, auto
    primary_color: str = "#7C3AED"  # violet by default
    welcome_message: Optional[str] = None
    placeholder: str = "Type your message..."
    allowed_domains: Optional[list] = None  # None means allow all
    position: str = "bottom-right"  # bottom-right, bottom-left
    show_branding: bool = True


class EnableEmbedRequest(BaseModel):
    """Request to enable embedding for an agent."""

    embed_config: Optional[EmbedConfig] = None


class EnableEmbedResponse(BaseModel):
    """Response after enabling embed."""

    agent_id: str
    embed_token: str
    embed_code: str
    embed_url: str


class EmbedAgentInfo(BaseModel):
    """Public agent info for embed initialization."""

    name: str
    avatar_url: Optional[str] = None
    welcome_message: Optional[str] = None
    theme: str = "light"
    primary_color: str = "#7C3AED"
    placeholder: str = "Type your message..."


class EmbedChatRequest(BaseModel):
    """Chat request for embedded widget."""

    message: str
    conversation_id: Optional[str] = None


class EmbedChatResponse(BaseModel):
    """Chat response for embedded widget."""

    message: str
    conversation_id: str


# =============================================================================
# Helper Functions
# =============================================================================

def generate_embed_token() -> str:
    """Generate a secure embed token."""
    return secrets.token_urlsafe(48)


async def get_user_from_clerk(clerk_user: CurrentUser, session: AsyncSessionDep):
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


# =============================================================================
# Admin Endpoints (Authenticated)
# =============================================================================

@router.post(
    "/{agent_id}/enable",
    response_model=EnableEmbedResponse,
    summary="Enable embedding for an agent",
    description="Enable embedding and get embed code for an agent component.",
)
async def enable_embed(
    agent_id: str,
    request: EnableEmbedRequest,
    req: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> EnableEmbedResponse:
    """Enable embedding for an agent and return embed code."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentComponentService(session)

    # Get the agent
    agent = await agent_service.get_by_id(agent_id, user_id=user.id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    # Generate embed token if not exists
    embed_token = agent.embed_token or generate_embed_token()

    # Prepare embed config
    config = request.embed_config or EmbedConfig()
    embed_config_dict = config.model_dump()

    # Update agent
    await agent_service.update(
        agent_id,
        user_id=user.id,
        is_embeddable=True,
        embed_token=embed_token,
        embed_config=embed_config_dict,
    )
    await session.commit()

    # Generate embed code
    base_url = str(req.base_url).rstrip("/")
    embed_url = f"{base_url}/api/v1/embed/{embed_token}"

    embed_code = f"""<!-- Teach Charlie AI Widget -->
<script>
  (function() {{
    var w = document.createElement('script');
    w.src = '{base_url}/api/v1/embed/widget.js';
    w.async = true;
    w.dataset.token = '{embed_token}';
    document.head.appendChild(w);
  }})();
</script>"""

    return EnableEmbedResponse(
        agent_id=agent_id,
        embed_token=embed_token,
        embed_code=embed_code,
        embed_url=embed_url,
    )


@router.post(
    "/{agent_id}/disable",
    summary="Disable embedding for an agent",
)
async def disable_embed(
    agent_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> Dict[str, Any]:
    """Disable embedding for an agent."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentComponentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    await agent_service.update(
        agent_id,
        user_id=user.id,
        is_embeddable=False,
    )
    await session.commit()

    return {"message": "Embedding disabled"}


@router.get(
    "/{agent_id}/code",
    summary="Get embed code for an agent",
)
async def get_embed_code(
    agent_id: str,
    req: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> Dict[str, Any]:
    """Get embed code for an agent."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentComponentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    if not agent.is_embeddable or not agent.embed_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Embedding not enabled for this agent",
        )

    base_url = str(req.base_url).rstrip("/")
    embed_code = f"""<!-- Teach Charlie AI Widget -->
<script>
  (function() {{
    var w = document.createElement('script');
    w.src = '{base_url}/api/v1/embed/widget.js';
    w.async = true;
    w.dataset.token = '{agent.embed_token}';
    document.head.appendChild(w);
  }})();
</script>"""

    return {
        "embed_code": embed_code,
        "embed_url": f"{base_url}/api/v1/embed/{agent.embed_token}",
        "embed_token": agent.embed_token,
    }


# =============================================================================
# Public Endpoints (No Auth Required)
# =============================================================================

@router.get(
    "/widget.js",
    summary="Get embed widget JavaScript",
    include_in_schema=False,
)
async def get_widget_js(req: Request) -> Response:
    """Return the embed widget JavaScript."""
    base_url = str(req.base_url).rstrip("/")

    # Minified widget JS
    widget_js = f"""
(function(){{
  var API_BASE='{base_url}/api/v1/embed';
  var token=document.currentScript.dataset.token;
  if(!token)return console.error('Teach Charlie: Missing embed token');

  var container=document.createElement('div');
  container.id='tc-widget-container';
  container.innerHTML=`
    <style>
      #tc-widget-btn{{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:#7C3AED;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;display:flex;align-items:center;justify-content:center;transition:transform 0.2s}}
      #tc-widget-btn:hover{{transform:scale(1.1)}}
      #tc-widget-btn svg{{width:28px;height:28px;fill:white}}
      #tc-widget-chat{{position:fixed;bottom:90px;right:20px;width:380px;height:500px;background:white;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:9999;display:none;flex-direction:column;overflow:hidden}}
      #tc-widget-chat.open{{display:flex}}
      #tc-header{{background:#7C3AED;color:white;padding:16px;display:flex;align-items:center;gap:12px}}
      #tc-header img{{width:40px;height:40px;border-radius:50%;background:white}}
      #tc-header-name{{font-weight:600;font-size:16px}}
      #tc-close{{margin-left:auto;background:none;border:none;color:white;cursor:pointer;padding:4px}}
      #tc-messages{{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}}
      .tc-msg{{max-width:80%;padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.5}}
      .tc-msg.user{{background:#7C3AED;color:white;margin-left:auto;border-bottom-right-radius:4px}}
      .tc-msg.assistant{{background:#f3f4f6;color:#111;border-bottom-left-radius:4px}}
      #tc-input-area{{padding:12px;border-top:1px solid #e5e7eb;display:flex;gap:8px}}
      #tc-input{{flex:1;padding:12px 16px;border:1px solid #e5e7eb;border-radius:24px;outline:none;font-size:14px}}
      #tc-input:focus{{border-color:#7C3AED}}
      #tc-send{{width:40px;height:40px;border-radius:50%;background:#7C3AED;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center}}
      #tc-send svg{{width:20px;height:20px;fill:white}}
      #tc-send:disabled{{opacity:0.5;cursor:not-allowed}}
    </style>
    <button id="tc-widget-btn" aria-label="Chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    </button>
    <div id="tc-widget-chat">
      <div id="tc-header">
        <img id="tc-avatar" src="" alt="">
        <span id="tc-header-name">Assistant</span>
        <button id="tc-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div id="tc-messages"></div>
      <div id="tc-input-area">
        <input id="tc-input" type="text" placeholder="Type a message...">
        <button id="tc-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  var btn=document.getElementById('tc-widget-btn');
  var chat=document.getElementById('tc-widget-chat');
  var close=document.getElementById('tc-close');
  var input=document.getElementById('tc-input');
  var send=document.getElementById('tc-send');
  var messages=document.getElementById('tc-messages');
  var avatar=document.getElementById('tc-avatar');
  var headerName=document.getElementById('tc-header-name');
  var conversationId=null;
  var isLoading=false;

  btn.onclick=function(){{chat.classList.add('open');btn.style.display='none'}};
  close.onclick=function(){{chat.classList.remove('open');btn.style.display='flex'}};

  fetch(API_BASE+'/'+token)
    .then(r=>r.json())
    .then(info=>{{
      headerName.textContent=info.name||'Assistant';
      if(info.avatar_url)avatar.src=info.avatar_url;
      else avatar.style.display='none';
      if(info.welcome_message)addMsg(info.welcome_message,'assistant');
      if(info.placeholder)input.placeholder=info.placeholder;
      if(info.primary_color){{
        document.getElementById('tc-widget-btn').style.background=info.primary_color;
        document.getElementById('tc-header').style.background=info.primary_color;
        document.getElementById('tc-send').style.background=info.primary_color;
      }}
    }});

  function addMsg(text,role){{
    var div=document.createElement('div');
    div.className='tc-msg '+role;
    div.textContent=text;
    messages.appendChild(div);
    messages.scrollTop=messages.scrollHeight;
  }}

  function sendMessage(){{
    var msg=input.value.trim();
    if(!msg||isLoading)return;
    addMsg(msg,'user');
    input.value='';
    isLoading=true;
    send.disabled=true;

    fetch(API_BASE+'/'+token+'/chat',{{
      method:'POST',
      headers:{{'Content-Type':'application/json'}},
      body:JSON.stringify({{message:msg,conversation_id:conversationId}})
    }})
    .then(r=>r.json())
    .then(data=>{{
      addMsg(data.message,'assistant');
      conversationId=data.conversation_id;
    }})
    .catch(e=>addMsg('Sorry, something went wrong.','assistant'))
    .finally(()=>{{isLoading=false;send.disabled=false}});
  }}

  send.onclick=sendMessage;
  input.onkeypress=function(e){{if(e.key==='Enter')sendMessage()}};
}})();
"""
    return Response(
        content=widget_js,
        media_type="application/javascript",
        headers={"Cache-Control": "public, max-age=3600"},
    )


@router.get(
    "/{embed_token}",
    response_model=EmbedAgentInfo,
    summary="Get agent info for embed",
)
async def get_embed_agent_info(
    embed_token: str,
    session: AsyncSessionDep,
) -> EmbedAgentInfo:
    """Get public agent info for embed initialization (no auth required)."""
    agent_service = AgentComponentService(session)

    # Find agent by embed token
    agent = await agent_service.get_by_embed_token(embed_token)
    if not agent or not agent.is_embeddable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Embed not found or disabled",
        )

    config = agent.embed_config or {}

    return EmbedAgentInfo(
        name=agent.name,
        avatar_url=agent.avatar_url,
        welcome_message=config.get("welcome_message"),
        theme=config.get("theme", "light"),
        primary_color=config.get("primary_color", "#7C3AED"),
        placeholder=config.get("placeholder", "Type your message..."),
    )


@router.post(
    "/{embed_token}/chat",
    response_model=EmbedChatResponse,
    summary="Chat via embed widget",
)
async def embed_chat(
    embed_token: str,
    request: EmbedChatRequest,
    session: AsyncSessionDep,
) -> EmbedChatResponse:
    """Handle chat messages from embed widget (no auth required)."""
    agent_service = AgentComponentService(session)

    # Find agent by embed token
    agent = await agent_service.get_by_embed_token(embed_token)
    if not agent or not agent.is_embeddable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Embed not found or disabled",
        )

    # TODO: Check allowed domains from request origin

    # Get response from agent
    try:
        response = await agent_service.chat(
            agent.id,
            request.message,
            user_id=agent.user_id,  # Use agent owner's context
            conversation_id=request.conversation_id,
        )

        return EmbedChatResponse(
            message=response.get("message", ""),
            conversation_id=response.get("conversation_id", ""),
        )

    except Exception as e:
        logger.error(f"Embed chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message",
        )
