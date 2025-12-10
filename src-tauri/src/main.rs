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
  caminho_unimake: Option<String>,
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

// File operations for TXT/XML
#[tauri::command]
async fn gerar_txt(
  caminho: String,
  conteudo: String,
) -> Result<String, String> {
  let path = std::path::Path::new(&caminho);
  
  // Create parent directories if they don't exist
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent).map_err(|e| format!("Erro ao criar diretórios: {}", e))?;
  }
  
  fs::write(path, conteudo).map_err(|e| format!("Erro ao escrever arquivo: {}", e))?;
  
  Ok(format!("Arquivo gerado com sucesso em: {}", caminho))
}

#[tauri::command]
async fn ler_arquivo(caminho: String) -> Result<String, String> {
  let path = std::path::Path::new(&caminho);
  
  if !path.exists() {
    return Err(format!("Arquivo não encontrado: {}", caminho));
  }
  
  fs::read_to_string(path).map_err(|e| format!("Erro ao ler arquivo: {}", e))
}

#[tauri::command]
async fn listar_arquivos_diretorio(
  caminho: String,
  extensao: Option<String>,
) -> Result<Vec<String>, String> {
  let path = std::path::Path::new(&caminho);
  
  if !path.exists() {
    return Err(format!("Diretório não encontrado: {}", caminho));
  }
  
  if !path.is_dir() {
    return Err(format!("Caminho não é um diretório: {}", caminho));
  }
  
  let entries = fs::read_dir(path).map_err(|e| format!("Erro ao ler diretório: {}", e))?;
  
  let mut files = Vec::new();
  
  for entry in entries {
    if let Ok(entry) = entry {
      let path = entry.path();
      if path.is_file() {
        if let Some(ref ext) = extensao {
          if let Some(file_ext) = path.extension() {
            if file_ext == ext.as_str() {
              if let Some(path_str) = path.to_str() {
                files.push(path_str.to_string());
              }
            }
          }
        } else {
          if let Some(path_str) = path.to_str() {
            files.push(path_str.to_string());
          }
        }
      }
    }
  }
  
  Ok(files)
}

#[tauri::command]
async fn verificar_caminho_existe(caminho: String) -> Result<bool, String> {
  let path = std::path::Path::new(&caminho);
  Ok(path.exists())
}

#[tauri::command]
async fn salvar_configuracao(
  app: AppHandle,
  servidor_ip: String,
  usuario_banco: String,
  senha_banco: String,
  porta: u16,
  nome_banco: String,
  caminho_unimake: Option<String>,
) -> Result<String, String> {
  // Validate Unimake path if provided
  if let Some(ref path) = caminho_unimake {
    if !path.is_empty() {
      let unimake_path = std::path::Path::new(path);
      if !unimake_path.exists() {
        return Err(format!("Caminho do Unimake não existe: {}", path));
      }
    }
  }

  let cfg = Config {
    servidor_ip,
    usuario_banco,
    senha_banco,
    porta,
    nome_banco,
    caminho_unimake,
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
      excluir_configuracao,
      gerar_txt,
      ler_arquivo,
      listar_arquivos_diretorio,
      verificar_caminho_existe
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}