import { useState } from "react";
import { Stack, TextField, Button, Typography, Alert, Box } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import LayoutSimples from "../../layouts/LayoutSimples";

export default function TelaConfiguracaoInicial() {
  const [ip, setIp] = useState("127.0.0.1");
  const [usuario, setUsuario] = useState("root");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const nav = useNavigate();

  const salvar = async () => {
    try {
      setErro("");
      setLoading(true);
      const caminho = await invoke<string>("salvar_configuracao", {
        servidorIp: ip,
        usuarioBanco: usuario,
        senhaBanco: senha,
      });
      console.log("Configuracao salva em:", caminho);
      nav("/login");
    } catch (e) {
      setErro("Falha ao salvar configuracao: " + e);
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
          Configure a conexão com o banco de dados
        </Typography>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
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
        <Button variant="contained" onClick={salvar} disabled={loading} size="large" fullWidth>
          {loading ? "Salvando..." : "Salvar e Continuar"}
        </Button>
      </Stack>
    </LayoutSimples>
  );
}
