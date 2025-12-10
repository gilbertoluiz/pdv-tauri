#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};
use tauri::{Manager, AppHandle};
use tauri::path::BaseDirectory;

#[derive(serde::Serialize, serde::Deserialize)]
struct Config {
  servidor_ip: String,
  usuario_banco: String,
  senha_banco: String,
  porta: u16,
  nome_banco: String,
}

#[tauri::command]
async fn salvar_configuracao(
  app: AppHandle,
  servidor_ip: String,
  usuario_banco: String,
  senha_banco: String,
) -> Result<String, String> {
  let cfg = Config {
    servidor_ip,
    usuario_banco,
    senha_banco,
    porta: 3306,
    nome_banco: "pdv".to_string(),
  };

  let path: PathBuf = app
    .path()
    .resolve("config.json", BaseDirectory::AppConfig)
    .map_err(|e| e.to_string())?;

  if let Some(dir) = path.parent() {
    fs::create_dir_all(dir).map_err(|e| e.to_string())?;
  }

  let bytes = serde_json::to_vec_pretty(&cfg).map_err(|e| e.to_string())?;
  fs::write(&path, bytes).map_err(|e| e.to_string())?;

  Ok(path.to_string_lossy().to_string())
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![salvar_configuracao])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}