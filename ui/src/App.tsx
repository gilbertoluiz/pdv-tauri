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
} from "@mui/material";
import { criarTema } from "./tema";
import TelaConfiguracaoInicial from "./pages/TelaConfiguracaoInicial";
import TelaLogin from "./pages/TelaLogin";
import TelaPedidos from "./pages/TelaPedidos";

export default function App() {
  const [escuro, setEscuro] = useState(false);
  const tema = useMemo(() => criarTema(escuro), [escuro]);

  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PDV Suite
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Escuro
            </Typography>
            <Switch
              checked={escuro}
              onChange={(e) => setEscuro(e.target.checked)}
            />
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
