import { useState } from "react";
import { Stack, TextField, Button, Typography, Alert, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LayoutSimples from "../../layouts/LayoutSimples";

export default function TelaRecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleEnviar = async () => {
    try {
      setErro("");
      setCarregando(true);

      // Mock - substituir por chamada real à API/Tauri
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!email || !email.includes("@")) {
        throw new Error("Email inválido");
      }

      setEnviado(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao enviar email");
    } finally {
      setCarregando(false);
    }
  };

  const handleVoltar = () => {
    navigate("/login");
  };

  return (
    <LayoutSimples maxWidth="xs">
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          Recuperar Senha
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Digite seu email para receber instruções de recuperação
        </Typography>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      {enviado ? (
        <Stack spacing={3}>
          <Alert severity="success">
            <Typography variant="body2">
              Instruções de recuperação foram enviadas para <strong>{email}</strong>
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </Typography>

          <Button variant="outlined" onClick={handleVoltar} fullWidth>
            Voltar para Login
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleEnviar()}
            fullWidth
            autoFocus
            placeholder="seu@email.com"
          />

          <Button
            variant="contained"
            onClick={handleEnviar}
            disabled={carregando}
            fullWidth
            size="large"
          >
            {carregando ? "Enviando..." : "Enviar Instruções"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleVoltar}
              sx={{ cursor: "pointer" }}
            >
              Voltar para Login
            </Link>
          </Box>
        </Stack>
      )}
    </LayoutSimples>
  );
}
