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
    caminho_unimake: None, // Not needed for database connection test
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

// Generic database query command for SELECT operations
#[tauri::command]
async fn executar_query(
  app: AppHandle,
  query: String,
  params: Vec<String>,
) -> Result<Vec<serde_json::Value>, String> {
  let cfg = obter_configuracao(app).await?;
  
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

  // Convert params to query params
  let query_params: Vec<mysql::Value> = params.iter().map(|p| mysql::Value::from(p.as_str())).collect();
  
  let result: Vec<mysql::Row> = conn
    .exec(&query, query_params)
    .map_err(|e| format!("Erro ao executar query: {}", e))?;

  // Convert rows to JSON
  let mut json_result = Vec::new();
  for row in result {
    let mut obj = serde_json::Map::new();
    for (idx, col) in row.columns_ref().iter().enumerate() {
      let col_name = col.name_str().to_string();
      let value: mysql::Value = row.get(idx).unwrap_or(mysql::Value::NULL);
      
      let json_value = match value {
        mysql::Value::NULL => serde_json::Value::Null,
        mysql::Value::Int(i) => serde_json::Value::Number(i.into()),
        mysql::Value::UInt(u) => serde_json::Value::Number(u.into()),
        mysql::Value::Float(f) => serde_json::Number::from_f64(f).map(serde_json::Value::Number).unwrap_or(serde_json::Value::Null),
        mysql::Value::Double(d) => serde_json::Number::from_f64(d).map(serde_json::Value::Number).unwrap_or(serde_json::Value::Null),
        mysql::Value::Bytes(b) => serde_json::Value::String(String::from_utf8_lossy(&b).to_string()),
        mysql::Value::Date(y, m, d, h, min, s, _) => {
          serde_json::Value::String(format!("{:04}-{:02}-{:02} {:02}:{:02}:{:02}", y, m, d, h, min, s))
        },
        mysql::Value::Time(_, _, _, _, _, _) => serde_json::Value::String(format!("{:?}", value)),
      };
      
      obj.insert(col_name, json_value);
    }
    json_result.push(serde_json::Value::Object(obj));
  }

  Ok(json_result)
}

// Generic database command for INSERT/UPDATE/DELETE operations
#[tauri::command]
async fn executar_comando(
  app: AppHandle,
  comando: String,
  params: Vec<String>,
) -> Result<u64, String> {
  let cfg = obter_configuracao(app).await?;
  
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

  // Convert params to query params
  let query_params: Vec<mysql::Value> = params.iter().map(|p| mysql::Value::from(p.as_str())).collect();
  
  conn
    .exec_drop(&comando, query_params)
    .map_err(|e| format!("Erro ao executar comando: {}", e))?;

  Ok(conn.affected_rows())
}

// Create tables if they don't exist
#[tauri::command]
async fn inicializar_tabelas(app: AppHandle) -> Result<String, String> {
  let cfg = obter_configuracao(app).await?;
  
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

  // Create clientes table
  conn.query_drop(
    r"CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      telefone VARCHAR(20),
      cpf VARCHAR(14),
      cnpj VARCHAR(18),
      endereco TEXT,
      cidade VARCHAR(100),
      estado VARCHAR(2),
      ativo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )"
  ).map_err(|e| format!("Erro ao criar tabela clientes: {}", e))?;

  // Create produtos table
  conn.query_drop(
    r"CREATE TABLE IF NOT EXISTS produtos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      categoria VARCHAR(100),
      unidade VARCHAR(10),
      preco_custo DECIMAL(10, 2) DEFAULT 0,
      preco_venda DECIMAL(10, 2) NOT NULL,
      estoque INT DEFAULT 0,
      estoque_minimo INT DEFAULT 0,
      data_validade DATE,
      ativo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )"
  ).map_err(|e| format!("Erro ao criar tabela produtos: {}", e))?;

  Ok("Tabelas inicializadas com sucesso!".to_string())
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
      verificar_caminho_existe,
      executar_query,
      executar_comando,
      inicializar_tabelas
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}