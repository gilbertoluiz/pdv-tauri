import { createContext, useContext, useState, ReactNode } from "react";

export interface Permissao {
  modulo: string;
  submodulo?: string;
  ler: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  permissoes: Permissao[];
}

interface AuthContextData {
  usuario: Usuario | null;
  autenticado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  temPermissao: (modulo: string, submodulo?: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (email: string, senha: string) => {
    // Mock de autenticação - substituir por chamada real à API/Tauri
    if (email === "admin@pdv.com" && senha === "admin") {
      const usuarioMock: Usuario = {
        id: 1,
        nome: "Administrador",
        email: "admin@pdv.com",
        permissoes: [
          // Cadastros
          {
            modulo: "cadastro",
            submodulo: "clientes",
            ler: true,
            criar: true,
            editar: true,
            excluir: true,
          },
          {
            modulo: "cadastro",
            submodulo: "produtos",
            ler: true,
            criar: true,
            editar: true,
            excluir: true,
          },
          {
            modulo: "cadastro",
            submodulo: "fornecedores",
            ler: true,
            criar: true,
            editar: true,
            excluir: true,
          },
          {
            modulo: "cadastro",
            submodulo: "categorias",
            ler: true,
            criar: true,
            editar: true,
            excluir: true,
          },
          // Pedidos
          { modulo: "pedidos", ler: true, criar: true, editar: true, excluir: true },
          // Financeiro
          {
            modulo: "financeiro",
            submodulo: "contas-pagar",
            ler: true,
            criar: true,
            editar: true,
            excluir: true,
          },
          {
            modulo: "financeiro",
            submodulo: "contas-receber",
            ler: true,
            criar: true,
            editar: true,
            excluir: true,
          },
          // Relatórios
          {
            modulo: "relatorios",
            submodulo: "vendas",
            ler: true,
            criar: false,
            editar: false,
            excluir: false,
          },
          {
            modulo: "relatorios",
            submodulo: "estoque",
            ler: true,
            criar: false,
            editar: false,
            excluir: false,
          },
          // Configurações
          { modulo: "configuracoes", ler: true, criar: true, editar: true, excluir: true },
        ],
      };
      setUsuario(usuarioMock);
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  const temPermissao = (modulo: string, submodulo?: string): boolean => {
    if (!usuario) return false;

    const permissao = usuario.permissoes.find(
      (p) => p.modulo === modulo && (!submodulo || p.submodulo === submodulo)
    );

    return permissao ? permissao.ler : false;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        login,
        logout,
        temPermissao,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
