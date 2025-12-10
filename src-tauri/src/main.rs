#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};
use tauri::{Manager, AppHandle};
use tauri::path::BaseDirectory;
use mysql::*;
use mysql::prelude::*;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
struct Config {
  servidor_ip: String,
  usuario_banco: String,
  senha_banco: String,
  porta: u16,
  nome_banco: String,
}

// Helper function to get config path
fn obter_caminho_config(app: &AppHandle) -> Result<PathBuf, String> {
  app
    .path()
    .resolve("config.json", BaseDirectory::AppConfig)
    .map_err(|e| e.to_string())
}

// Test database connection
fn testar_conexao_db(cfg: &Config) -> Result<(), String> {
  let url = format!(
    "mysql://{}:{}@{}:{}/{}",
    cfg.usuario_banco,
    cfg.senha_banco,
    cfg.servidor_ip,
    cfg.porta,
    cfg.nome_banco
  );

  let pool = Pool::new(url.as_str()).map_err(|e| format!("Erro ao criar pool: {}", e))?;
  
  let mut conn = pool.get_conn().map_err(|e| format!("Erro ao conectar ao banco: {}", e))?;
  
  // Test the connection with a simple query
  conn.query_drop("SELECT 1").map_err(|e| format!("Erro ao executar query de teste: {}", e))?;
  
  Ok(())
}

#[tauri::command]
async fn verificar_configuracao(app: AppHandle) -> Result<bool, String> {
  let path = obter_caminho_config(&app)?;
  Ok(path.exists())
}

#[tauri::command]
async fn obter_configuracao(app: AppHandle) -> Result<Config, String> {
  let path = obter_caminho_config(&app)?;
  
  if !path.exists() {
    return Err("Configuração não encontrada".to_string());
  }

  let bytes = fs::read(&path).map_err(|e| e.to_string())?;
  let cfg: Config = serde_json::from_slice(&bytes).map_err(|e| e.to_string())?;
  
  Ok(cfg)
}

#[tauri::command]
async fn testar_conexao(
  servidor_ip: String,
  usuario_banco: String,
  senha_banco: String,
  porta: u16,
  nome_banco: String,
) -> Result<String, String> {
  let cfg = Config {
    servidor_ip,
    usuario_banco,
    senha_banco,
    porta,
    nome_banco,
  };

  testar_conexao_db(&cfg)?;
  
  Ok("Conexão estabelecida com sucesso!".to_string())
}

#[tauri::command]
async fn excluir_configuracao(app: AppHandle) -> Result<String, String> {
  let path = obter_caminho_config(&app)?;
  
  if path.exists() {
    fs::remove_file(&path).map_err(|e| e.to_string())?;
    Ok("Configuração removida com sucesso".to_string())
  } else {
    Err("Configuração não encontrada".to_string())
  }
}

#[tauri::command]
async fn salvar_configuracao(
  app: AppHandle,
  servidor_ip: String,
  usuario_banco: String,
  senha_banco: String,
  porta: u16,
  nome_banco: String,
) -> Result<String, String> {
  let cfg = Config {
    servidor_ip,
    usuario_banco,
    senha_banco,
    porta,
    nome_banco,
  };

  // Test connection before saving
  testar_conexao_db(&cfg)?;

  let path = obter_caminho_config(&app)?;

  if let Some(dir) = path.parent() {
    fs::create_dir_all(dir).map_err(|e| e.to_string())?;
  }

  let bytes = serde_json::to_vec_pretty(&cfg).map_err(|e| e.to_string())?;
  fs::write(&path, bytes).map_err(|e| e.to_string())?;

  Ok("Configuração salva e conexão validada com sucesso!".to_string())
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      salvar_configuracao,
      verificar_configuracao,
      obter_configuracao,
      testar_conexao,
      excluir_configuracao
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}