import { useState } from "react";
import { Stack, TextField, Button, Typography, Alert, Box, CircularProgress } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import LayoutSimples from "../../layouts/LayoutSimples";

export default function TelaConfiguracaoInicial() {
  const [ip, setIp] = useState("127.0.0.1");
  const [usuario, setUsuario] = useState("root");
  const [senha, setSenha] = useState("");
  const [porta, setPorta] = useState(3306);
  const [nomeBanco, setNomeBanco] = useState("pdv");
  const [loading, setLoading] = useState(false);
  const [testando, setTestando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const nav = useNavigate();

  const testarConexao = async () => {
    try {
      setErro("");
      setSucesso("");
      setTestando(true);
      const mensagem = await invoke<string>("testar_conexao", {
        servidorIp: ip,
        usuarioBanco: usuario,
        senhaBanco: senha,
        porta: porta,
        nomeBanco: nomeBanco,
      });
      setSucesso(mensagem);
    } catch (e) {
      setErro("Falha ao conectar: " + e);
    } finally {
      setTestando(false);
    }
  };

  const salvar = async () => {
    try {
      setErro("");
      setSucesso("");
      setLoading(true);
      const mensagem = await invoke<string>("salvar_configuracao", {
        servidorIp: ip,
        usuarioBanco: usuario,
        senhaBanco: senha,
        porta: porta,
        nomeBanco: nomeBanco,
      });
      setSucesso(mensagem);
      setTimeout(() => {
        nav("/login");
      }, 1500);
    } catch (e) {
      setErro("Falha ao salvar configuração: " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutSimples maxWidth="sm">
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Configuração Inicial
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure a conexão com o banco de dados MySQL
        </Typography>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      {sucesso && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {sucesso}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          label="IP do Servidor MySQL"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          fullWidth
          placeholder="127.0.0.1"
        />
        <TextField
          label="Porta"
          type="number"
          value={porta}
          onChange={(e) => setPorta(Number(e.target.value))}
          fullWidth
          placeholder="3306"
        />
        <TextField
          label="Nome do Banco de Dados"
          value={nomeBanco}
          onChange={(e) => setNomeBanco(e.target.value)}
          fullWidth
          placeholder="pdv"
        />
        <TextField
          label="Usuário do Banco"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          fullWidth
          placeholder="root"
        />
        <TextField
          label="Senha do Banco"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          fullWidth
        />
        <Button 
          variant="outlined" 
          onClick={testarConexao} 
          disabled={testando || loading} 
          size="large" 
          fullWidth
        >
          {testando ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Testando Conexão...
            </>
          ) : (
            "Testar Conexão"
          )}
        </Button>
        <Button 
          variant="contained" 
          onClick={salvar} 
          disabled={loading || testando} 
          size="large" 
          fullWidth
        >
          {loading ? "Salvando..." : "Salvar e Continuar"}
        </Button>
      </Stack>
    </LayoutSimples>
  );
}
