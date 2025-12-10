import { useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { criarTema, obterCoresPreDefinidas } from "./tema";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

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

function RotaPrivada({ children }: { children: JSX.Element }) {
  const { autenticado } = useAuth();
  return autenticado ? children : <Navigate to="/login" replace />;
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
