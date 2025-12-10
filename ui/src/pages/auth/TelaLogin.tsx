import { useState } from "react";
import { Stack, TextField, Button, Typography, Link, Alert, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LayoutSimples from "../../layouts/LayoutSimples";

export default function TelaLogin() {
  const [email, setEmail] = useState("admin@pdv.com");
  const [senha, setSenha] = useState("admin");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setErro("");
      setCarregando(true);
      await login(email, senha);
      navigate("/app/dashboard");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  };

  const handleRecuperarSenha = () => {
    navigate("/recuperar-senha");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <LayoutSimples maxWidth="xs">
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          PDV Suite
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Faça login para continuar
        </Typography>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          autoFocus
        />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={carregando}
          fullWidth
          size="large"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </Button>

        <Divider />

        <Box sx={{ textAlign: "center" }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleRecuperarSenha}
            sx={{ cursor: "pointer" }}
          >
            Esqueceu sua senha?
          </Link>
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Credenciais de teste: admin@pdv.com / admin
          </Typography>
        </Box>
      </Stack>
    </LayoutSimples>
  );
}
