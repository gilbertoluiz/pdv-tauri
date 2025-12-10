import { useState } from "react";
import { Stack, TextField, Button, Typography, Alert, Box, Paper } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

export default function TelaAlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const validarSenha = (): boolean => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Todos os campos são obrigatórios");
      return false;
    }

    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter no mínimo 6 caracteres");
      return false;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return false;
    }

    if (senhaAtual === novaSenha) {
      setErro("A nova senha deve ser diferente da atual");
      return false;
    }

    return true;
  };

  const handleAlterar = async () => {
    try {
      setErro("");

      if (!validarSenha()) {
        return;
      }

      setCarregando(true);

      // Mock - substituir por chamada real à API/Tauri
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSucesso(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      setTimeout(() => setSucesso(false), 5000);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao alterar senha");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Alterar Senha
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Mantenha sua conta segura alterando sua senha regularmente
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {sucesso && (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
            Senha alterada com sucesso!
          </Alert>
        )}

        <Stack spacing={2.5}>
          <TextField
            label="Senha Atual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            fullWidth
          />

          <TextField
            label="Nova Senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            fullWidth
            helperText="Mínimo de 6 caracteres"
          />

          <TextField
            label="Confirmar Nova Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            fullWidth
          />

          <Button variant="contained" onClick={handleAlterar} disabled={carregando} size="large">
            {carregando ? "Alterando..." : "Alterar Senha"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
