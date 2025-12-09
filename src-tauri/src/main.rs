#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use std::fs::{write};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone)]
struct ConfiguracaoAplicacao {
    conexao_mysql: String,
    pasta_unimake_envio: String,
    pasta_unimake_retorno: String,
    contingencia_offline: bool,
    tef_habilitado: bool,
    endereco_impressora: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
struct ItemPedido { sku: String, descricao: String, quantidade: f64, preco_unitario: f64 }
#[derive(Serialize, Deserialize, Clone)]
struct Pedido { id: i64, documento_cliente: String, criado_em: String, status: String, itens: Vec<ItemPedido>, chave_fiscal: Option<String>, protocolo: Option<String>, mensagem_erro: Option<String> }

#[tauri::command]
async fn salvar_configuracao(cfg: ConfiguracaoAplicacao) -> Result<(), String> {
    let caminho = config_path()?;
    let json = serde_json::to_string_pretty(&cfg).map_err(|e| e.to_string())?;
    write(caminho, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn entrar(usuario: String, senha: String) -> Result<bool, String> {
    Ok(!usuario.is_empty() && !senha.is_empty())
}

#[tauri::command]
async fn listar_pedidos() -> Result<Vec<Pedido>, String> {
    Ok(vec![Pedido {
        id: 1,
        documento_cliente: "00000000000".into(),
        criado_em: "2025-01-01T12:00:00Z".into(),
        status: "Rascunho".into(),
        itens: vec![],
        chave_fiscal: None,
        protocolo: None,
        mensagem_erro: None,
    }])
}

#[tauri::command]
async fn emitir_txt(pedido_id: i64, pasta_envio: String) -> Result<String, String> {
    let conteudo = format!("ID={}\nDOC={}", pedido_id, "00000000000");
    let arquivo = format!("{}/NFCe_{}.txt", pasta_envio, pedido_id);
    std::fs::write(&arquivo, conteudo).map_err(|e| e.to_string())?;
    Ok(arquivo)
}

fn config_path() -> Result<PathBuf, String> {
    let mut p = tauri::api::path::app_config_dir(&tauri::Env::default())
        .ok_or("sem pasta de config")?;
    std::fs::create_dir_all(&p).map_err(|e| e.to_string())?;
    p.push("pdv_suite_config.json");
    Ok(p)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            salvar_configuracao, entrar, listar_pedidos, emitir_txt
        ])
        .run(tauri::generate_context!())
        .expect("erro ao iniciar tauri");
}