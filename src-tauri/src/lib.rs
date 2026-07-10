#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(desktop)]
mod desktop {
    use tauri::{
        menu::{Menu, MenuItem},
        tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
        Manager,
    };

    pub fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
        let quit = MenuItem::with_id(app, "quit", "Beenden", true, None::<&str>)?;
        let show = MenuItem::with_id(app, "show", "Fenster anzeigen", true, None::<&str>)?;
        let hide = MenuItem::with_id(app, "hide", "Minimieren", true, None::<&str>)?;

        let menu = Menu::with_items(app, &[&show, &hide, &quit])?;

        let _tray = TrayIconBuilder::new()
            .icon(app.default_window_icon().unwrap().clone())
            .menu(&menu)
            .show_menu_on_left_click(false)
            .on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } = event
                {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            })
            .on_menu_event(|app, event| match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "hide" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.hide();
                    }
                }
                _ => {}
            })
            .build(app)?;

        Ok(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_shell::init());
    }

    Ok(builder
        .setup(|_app| {
            #[cfg(desktop)]
            {
                desktop::setup_tray(_app)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())?)
}
