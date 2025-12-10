import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function TelaConfiguracaoInicial() {
  const [ip, setIp] = useState("127.0.0.1");
  const [usuario, setUsuario] = useState("root");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const salvar = async () => {
    try {
      setLoading(true);
      const caminho = await invoke<string>("salvar_configuracao", {
        servidorIp: ip,
        usuarioBanco: usuario,
        senhaBanco: senha,
      });
      console.log("Configuracao salva em:", caminho);
      nav("/login");
    } catch (e) {
      alert("Falha ao salvar configuracao: " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} maxWidth={420}>
      <TextField
        label="IP servidor (MySQL)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        size="small"
      />
      <TextField
        label="Usuario banco"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        size="small"
      />
      <TextField
        label="Senha banco"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        size="small"
      />
      <Button variant="contained" onClick={salvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar e continuar"}
      </Button>
    </Stack>
  );
}
