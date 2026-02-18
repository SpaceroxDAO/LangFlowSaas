use crate::state::{AppState, DesktopConfig};
use serde_json;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_shell::ShellExt;

/// Get the config directory path (~/.teach-charlie/)
fn config_dir() -> PathBuf {
    let home = dirs::home_dir().expect("Could not determine home directory");
    home.join(".teach-charlie")
}

/// Get the config file path
fn config_path() -> PathBuf {
    config_dir().join("config.json")
}

/// Load config from disk
#[tauri::command]
pub fn load_config(state: State<'_, AppState>) -> Result<DesktopConfig, String> {
    let path = config_path();
    if !path.exists() {
        return Ok(DesktopConfig::default());
    }
    let data = fs::read_to_string(&path).map_err(|e| format!("Failed to read config: {}", e))?;
    let config: DesktopConfig =
        serde_json::from_str(&data).map_err(|e| format!("Failed to parse config: {}", e))?;

    // Update in-memory state
    let mut state_config = state.config.lock().map_err(|e| e.to_string())?;
    *state_config = config.clone();

    Ok(config)
}

/// Save config to disk
#[tauri::command]
pub fn store_config(state: State<'_, AppState>, config: DesktopConfig) -> Result<(), String> {
    let dir = config_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create config dir: {}", e))?;

    let data =
        serde_json::to_string_pretty(&config).map_err(|e| format!("Failed to serialize: {}", e))?;
    fs::write(config_path(), data).map_err(|e| format!("Failed to write config: {}", e))?;

    // Update in-memory state
    let mut state_config = state.config.lock().map_err(|e| e.to_string())?;
    *state_config = config;

    Ok(())
}

/// Write the MCP config file for OpenClaw/Claude Desktop discovery
#[tauri::command]
pub fn write_mcp_config(token: String, api_url: String) -> Result<String, String> {
    let dir = config_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create dir: {}", e))?;

    let mcp_config = serde_json::json!({
        "mcpServers": {
            "teach-charlie": {
                "command": "tc-connector",
                "args": ["--token", token, "--api-url", api_url]
            }
        }
    });

    let path = dir.join("mcp-config.json");
    let data = serde_json::to_string_pretty(&mcp_config)
        .map_err(|e| format!("Failed to serialize: {}", e))?;
    fs::write(&path, &data).map_err(|e| format!("Failed to write mcp-config: {}", e))?;

    Ok(path.to_string_lossy().to_string())
}

/// Start the tc-connector sidecar process
#[tauri::command]
pub async fn start_sidecar(
    app: AppHandle,
    state: State<'_, AppState>,
    token: String,
    api_url: String,
) -> Result<(), String> {
    // Check if already running
    {
        let sidecar = state.sidecar.lock().map_err(|e| e.to_string())?;
        if sidecar.running {
            return Ok(());
        }
    }

    let shell = app.shell();
    let sidecar_command = shell
        .sidecar("binaries/tc-connector")
        .map_err(|e| format!("Failed to create sidecar command: {}", e))?
        .args(["--token", &token, "--api-url", &api_url]);

    let (mut _rx, child) = sidecar_command
        .spawn()
        .map_err(|e| format!("Failed to spawn sidecar: {}", e))?;

    // Store the child process handle
    let mut sidecar = state.sidecar.lock().map_err(|e| e.to_string())?;
    sidecar.child = Some(child);
    sidecar.running = true;

    // Emit event to frontend
    let _ = app.emit("sidecar-status", "running");

    Ok(())
}

/// Stop the tc-connector sidecar process
#[tauri::command]
pub async fn stop_sidecar(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut sidecar = state.sidecar.lock().map_err(|e| e.to_string())?;
    if let Some(child) = sidecar.child.take() {
        child
            .kill()
            .map_err(|e| format!("Failed to kill sidecar: {}", e))?;
    }
    sidecar.running = false;

    let _ = app.emit("sidecar-status", "stopped");

    Ok(())
}

/// Check sidecar status
#[tauri::command]
pub fn sidecar_status(state: State<'_, AppState>) -> Result<bool, String> {
    let sidecar = state.sidecar.lock().map_err(|e| e.to_string())?;
    Ok(sidecar.running)
}

/// Get the config directory path (for display in settings)
#[tauri::command]
pub fn get_config_path() -> String {
    config_path().to_string_lossy().to_string()
}
