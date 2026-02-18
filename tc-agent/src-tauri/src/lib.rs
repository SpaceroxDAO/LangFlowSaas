mod commands;
mod state;

use state::AppState;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    Manager, WindowEvent,
};
use tauri_plugin_autostart::MacosLauncher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::AppleScript,
            None,
        ))
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            commands::load_config,
            commands::store_config,
            commands::write_mcp_config,
            commands::start_sidecar,
            commands::stop_sidecar,
            commands::sidecar_status,
            commands::get_config_path,
        ])
        .setup(|app| {
            // Build tray menu
            let show_item = MenuItemBuilder::with_id("show", "Show Teach Charlie").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show_item)
                .separator()
                .item(&quit_item)
                .build()?;

            // Build tray icon using the app's default window icon
            let icon = app
                .default_window_icon()
                .cloned()
                .expect("default window icon not set");

            let _tray = TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .tooltip("Teach Charlie")
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            // Hide to tray on close instead of quitting
            if let WindowEvent::CloseRequested { api, .. } = event {
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Teach Charlie");
}
