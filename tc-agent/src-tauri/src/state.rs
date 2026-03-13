use serde::{Deserialize, Serialize};
use std::sync::Mutex;

/// Persisted config stored at ~/.teach-charlie/config.json
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DesktopConfig {
    pub api_url: Option<String>,
    pub mcp_token: Option<String>,
    pub clerk_session: Option<String>,
    pub auto_start: Option<bool>,
}

/// OpenClaw daemon state
pub struct OpenClawState {
    pub installed: bool,
    pub daemon_running: bool,
    pub config_written: bool,
}

impl Default for OpenClawState {
    fn default() -> Self {
        Self {
            installed: false,
            daemon_running: false,
            config_written: false,
        }
    }
}

/// Global app state managed by Tauri
pub struct AppState {
    pub config: Mutex<DesktopConfig>,
    pub openclaw: Mutex<OpenClawState>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            config: Mutex::new(DesktopConfig::default()),
            openclaw: Mutex::new(OpenClawState::default()),
        }
    }
}
