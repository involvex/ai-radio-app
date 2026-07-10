#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    if let Err(e) = ai_radio_lib::run() {
        eprintln!("Fatal error: {e}");
        std::process::exit(1);
    }
}
