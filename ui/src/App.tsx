import { useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Switch,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { criarTema, obterCoresPreDefinidas } from "./tema";
import TelaConfiguracaoInicial from "./pages/config/TelaConfiguracaoInicial";
import TelaLogin from "./pages/auth/TelaLogin";
import TelaPedidos from "./pages/app/TelaPedidos";

export default function App() {
  const [escuro, setEscuro] = useState(false);
  const [esquemaCor, setEsquemaCor] = useState("padrao");

  const coresDisponiveis = useMemo(() => obterCoresPreDefinidas(), []);
  const coresSelecionadas = useMemo(
    () => coresDisponiveis[esquemaCor],
    [esquemaCor, coresDisponiveis]
  );
  const tema = useMemo(() => criarTema(escuro, coresSelecionadas), [escuro, coresSelecionadas]);

  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PDV Suite
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: "white" }}>Tema</InputLabel>
              <Select
                value={esquemaCor}
                onChange={(e) => setEsquemaCor(e.target.value)}
                label="Tema"
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.5)" },
                }}
              >
                {Object.keys(coresDisponiveis).map((chave) => (
                  <MenuItem key={chave} value={chave}>
                    {chave.charAt(0).toUpperCase() + chave.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Escuro
              </Typography>
              <Switch checked={escuro} onChange={(e) => setEscuro(e.target.checked)} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<TelaConfiguracaoInicial />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/pedidos" element={<TelaPedidos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}
