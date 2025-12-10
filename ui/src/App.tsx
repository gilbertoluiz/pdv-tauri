import { useMemo, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { criarTema, obterCoresPreDefinidas } from "./tema";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { invoke } from "@tauri-apps/api/core";

// Layouts
import LayoutPrincipal from "./layouts/LayoutPrincipal";

// Páginas públicas
import TelaConfiguracaoInicial from "./pages/config/TelaConfiguracaoInicial";
import TelaLogin from "./pages/auth/TelaLogin";
import TelaRecuperarSenha from "./pages/auth/TelaRecuperarSenha";

// Páginas da aplicação
import TelaDashboard from "./pages/app/TelaDashboard";
import TelaPedidos from "./pages/app/TelaPedidos";
import TelaConfiguracoes from "./pages/configuracoes/TelaConfiguracoes";
import TelaClientes from "./pages/cadastro/TelaClientes";
import TelaProdutos from "./pages/cadastro/TelaProdutos";
import TelaExemploFormularioDinamico from "./pages/cadastro/TelaExemploFormularioDinamico";

function RotaPrivada({ children }: { children: JSX.Element }) {
  const { autenticado } = useAuth();
  return autenticado ? children : <Navigate to="/login" replace />;
}

function ConfigChecker({ children }: { children: JSX.Element }) {
  const [verificando, setVerificando] = useState(true);
  const [configurado, setConfigurado] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verificar = async () => {
      try {
        const existe = await invoke<boolean>("verificar_configuracao");
        setConfigurado(existe);
        
        // If not configured and not on config page, redirect
        if (!existe && location.pathname !== "/") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar configuração:", error);
        setConfigurado(false);
      } finally {
        setVerificando(false);
      }
    };

    verificar();
  }, [navigate, location.pathname]);

  if (verificando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Allow access to config page regardless
  if (location.pathname === "/") {
    return children;
  }

  // Redirect to config if not configured
  if (!configurado) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRotas() {
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
      <ConfigChecker>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<TelaConfiguracaoInicial />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/recuperar-senha" element={<TelaRecuperarSenha />} />

          {/* Rotas privadas com layout principal */}
          <Route
            path="/app/*"
            element={
              <RotaPrivada>
                <LayoutPrincipal
                  esquemaCor={esquemaCor}
                  setEsquemaCor={setEsquemaCor}
                  escuro={escuro}
                  setEscuro={setEscuro}
                  coresDisponiveis={coresDisponiveis}
                >
                  <Routes>
                    <Route path="dashboard" element={<TelaDashboard />} />
                    <Route path="pedidos" element={<TelaPedidos />} />
                    <Route path="configuracoes" element={<TelaConfiguracoes />} />
                    <Route path="cadastro/clientes" element={<TelaClientes />} />
                    <Route path="cadastro/produtos" element={<TelaProdutos />} />
                    <Route path="cadastro/exemplo-formulario" element={<TelaExemploFormularioDinamico />} />
                    <Route
                      path="cadastro/fornecedores"
                      element={
                        <div>
                          <h2>Fornecedores</h2>
                          <p>Em desenvolvimento</p>
                        </div>
                      }
                    />
                    <Route
                      path="cadastro/categorias"
                      element={
                        <div>
                          <h2>Categorias</h2>
                          <p>Em desenvolvimento</p>
                        </div>
                      }
                    />
                    <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                  </Routes>
                </LayoutPrincipal>
              </RotaPrivada>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ConfigChecker>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRotas />
    </AuthProvider>
  );
}
