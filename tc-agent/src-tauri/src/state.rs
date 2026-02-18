use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri_plugin_shell::process::CommandChild;

/// Persisted config stored at ~/.teach-charlie/config.json
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DesktopConfig {
    pub api_url: Option<String>,
    pub mcp_token: Option<String>,
    pub clerk_session: Option<String>,
    pub auto_start: Option<bool>,
}

/// Sidecar process state
pub struct SidecarState {
    pub child: Option<CommandChild>,
    pub running: bool,
}

impl Default for SidecarState {
    fn default() -> Self {
        Self {
            child: None,
            running: false,
        }
    }
}

/// Global app state managed by Tauri
pub struct AppState {
    pub config: Mutex<DesktopConfig>,
    pub sidecar: Mutex<SidecarState>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            config: Mutex::new(DesktopConfig::default()),
            sidecar: Mutex::new(SidecarState::default()),
        }
    }
}
