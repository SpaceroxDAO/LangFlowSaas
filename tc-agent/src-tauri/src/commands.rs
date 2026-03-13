use crate::state::{AppState, DesktopConfig};
use serde::{Deserialize, Serialize};
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

/// Get the OpenClaw config directory (~/.openclaw/)
fn openclaw_dir() -> PathBuf {
    let home = dirs::home_dir().expect("Could not determine home directory");
    home.join(".openclaw")
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

/// Get the config directory path (for display in settings)
#[tauri::command]
pub fn get_config_path() -> String {
    config_path().to_string_lossy().to_string()
}

// ---------- OpenClaw commands ----------

#[derive(Serialize)]
pub struct OpenClawCheckResult {
    pub installed: bool,
    pub version: Option<String>,
}

/// Check if OpenClaw is installed by running `openclaw --version`
#[tauri::command]
pub async fn check_openclaw(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<OpenClawCheckResult, String> {
    let shell = app.shell();

    // Try `openclaw --version` directly
    let output = shell
        .command("openclaw")
        .args(["--version"])
        .output()
        .await;

    if let Ok(out) = output {
        if out.status.success() {
            let version = String::from_utf8_lossy(&out.stdout).trim().to_string();
            let mut oc = state.openclaw.lock().map_err(|e| e.to_string())?;
            oc.installed = true;
            return Ok(OpenClawCheckResult {
                installed: true,
                version: Some(version),
            });
        }
    }

    // On macOS, also check common npm global paths since Tauri shell may not have full PATH
    #[cfg(target_os = "macos")]
    {
        let home = dirs::home_dir().unwrap_or_default();
        let extra_paths = vec![
            PathBuf::from("/usr/local/bin/openclaw"),
            PathBuf::from("/opt/homebrew/bin/openclaw"),
            home.join(".npm-packages/bin/openclaw"),
            home.join(".nvm/versions/node"), // will check below
        ];

        for p in &extra_paths[..3] {
            if p.exists() {
                let out = shell
                    .command(p.to_string_lossy().to_string())
                    .args(["--version"])
                    .output()
                    .await;
                if let Ok(out) = out {
                    if out.status.success() {
                        let version = String::from_utf8_lossy(&out.stdout).trim().to_string();
                        let mut oc = state.openclaw.lock().map_err(|e| e.to_string())?;
                        oc.installed = true;
                        return Ok(OpenClawCheckResult {
                            installed: true,
                            version: Some(version),
                        });
                    }
                }
            }
        }
    }

    let mut oc = state.openclaw.lock().map_err(|e| e.to_string())?;
    oc.installed = false;
    Ok(OpenClawCheckResult {
        installed: false,
        version: None,
    })
}

/// Install OpenClaw globally via npm
#[tauri::command]
pub async fn install_openclaw(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let shell = app.shell();

    let _ = app.emit("openclaw-install-progress", "starting");

    // Try user-level install first (no sudo needed)
    let _ = app.emit("openclaw-install-progress", "installing");

    let output = shell
        .command("npm")
        .args(["install", "-g", "openclaw@latest"])
        .output()
        .await
        .map_err(|e| format!("Failed to run npm: {}", e))?;

    if !output.status.success() {
        // On macOS, try with user prefix if global install fails (no sudo)
        #[cfg(target_os = "macos")]
        {
            let home = dirs::home_dir().unwrap_or_default();
            let prefix = home.join(".npm-packages");
            let _ = app.emit("openclaw-install-progress", "retrying with user prefix");

            let output2 = shell
                .command("npm")
                .args([
                    "install",
                    "-g",
                    "openclaw@latest",
                    "--prefix",
                    &prefix.to_string_lossy(),
                ])
                .output()
                .await
                .map_err(|e| format!("Failed to run npm (user prefix): {}", e))?;

            if !output2.status.success() {
                let stderr = String::from_utf8_lossy(&output2.stderr);
                let _ = app.emit("openclaw-install-progress", "failed");
                return Err(format!("npm install failed: {}", stderr));
            }
        }

        #[cfg(not(target_os = "macos"))]
        {
            let stderr = String::from_utf8_lossy(&output.stderr);
            let _ = app.emit("openclaw-install-progress", "failed");
            return Err(format!("npm install failed: {}", stderr));
        }
    }

    let mut oc = state.openclaw.lock().map_err(|e| e.to_string())?;
    oc.installed = true;

    let _ = app.emit("openclaw-install-progress", "complete");

    Ok("OpenClaw installed successfully".to_string())
}

#[derive(Deserialize)]
pub struct OpenClawConfigData {
    pub token: String,
    pub agent_name: String,
    pub system_prompt: Option<String>,
    pub avatar_url: Option<String>,
    pub skills: Vec<String>,
}

/// Write the OpenClaw config file at ~/.openclaw/openclaw.json
#[tauri::command]
pub async fn write_openclaw_config(
    state: State<'_, AppState>,
    data: OpenClawConfigData,
) -> Result<String, String> {
    let dir = openclaw_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create ~/.openclaw/: {}", e))?;

    let config_path = dir.join("openclaw.json");

    // Backup existing config if present
    if config_path.exists() {
        let backup_path = dir.join("openclaw.json.bak");
        let _ = fs::copy(&config_path, &backup_path);
    }

    // Build the config matching the mcpConfigGenerator format
    let mut teach_charlie = serde_json::Map::new();
    teach_charlie.insert(
        "agentName".to_string(),
        serde_json::Value::String(data.agent_name),
    );
    if let Some(ref sp) = data.system_prompt {
        teach_charlie.insert(
            "systemPrompt".to_string(),
            serde_json::Value::String(sp.clone()),
        );
    }
    if let Some(ref av) = data.avatar_url {
        teach_charlie.insert(
            "avatarUrl".to_string(),
            serde_json::Value::String(av.clone()),
        );
    }
    if !data.skills.is_empty() {
        teach_charlie.insert(
            "skills".to_string(),
            serde_json::Value::Array(
                data.skills
                    .iter()
                    .map(|s| serde_json::Value::String(s.clone()))
                    .collect(),
            ),
        );
    }

    let config = serde_json::json!({
        "mcpServers": {
            "teach-charlie": {
                "command": "npx",
                "args": ["tc-connector", "--token", data.token]
            }
        },
        "teachCharlie": teach_charlie
    });

    let json_str = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    fs::write(&config_path, &json_str)
        .map_err(|e| format!("Failed to write openclaw.json: {}", e))?;

    let mut oc = state.openclaw.lock().map_err(|e| e.to_string())?;
    oc.config_written = true;

    Ok(config_path.to_string_lossy().to_string())
}

#[derive(Serialize)]
pub struct DaemonResult {
    pub status: String,
    pub output: String,
}

/// Control the OpenClaw daemon: start, stop, or status
#[tauri::command]
pub async fn control_openclaw_daemon(
    app: AppHandle,
    state: State<'_, AppState>,
    action: String,
) -> Result<DaemonResult, String> {
    let shell = app.shell();

    let args = match action.as_str() {
        "start" => vec!["daemon", "start"],
        "stop" => vec!["daemon", "stop"],
        "status" => vec!["daemon", "status"],
        _ => return Err(format!("Unknown action: {}", action)),
    };

    let output = shell
        .command("openclaw")
        .args(&args)
        .output()
        .await
        .map_err(|e| format!("Failed to run openclaw daemon {}: {}", action, e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    let combined = if stderr.is_empty() {
        stdout.clone()
    } else {
        format!("{}\n{}", stdout, stderr)
    };

    // Update state based on action and result
    let status = if output.status.success() {
        let mut oc = state.openclaw.lock().map_err(|e| e.to_string())?;
        match action.as_str() {
            "start" => {
                oc.daemon_running = true;
                let _ = app.emit("openclaw-daemon-status", "running");
                "running"
            }
            "stop" => {
                oc.daemon_running = false;
                let _ = app.emit("openclaw-daemon-status", "stopped");
                "stopped"
            }
            "status" => {
                // Parse output to determine if running
                let running = stdout.to_lowercase().contains("running");
                oc.daemon_running = running;
                if running {
                    "running"
                } else {
                    "stopped"
                }
            }
            _ => "unknown",
        }
    } else {
        "error"
    };

    Ok(DaemonResult {
        status: status.to_string(),
        output: combined,
    })
}
