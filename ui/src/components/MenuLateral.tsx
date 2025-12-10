import { useState } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider } from "@mui/material";
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  PersonAdd,
  Category,
  Store,
  Receipt,
  AccountBalance,
  DynamicForm,
  Folder,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ItemMenu {
  titulo: string;
  icone: JSX.Element;
  rota?: string;
  modulo: string;
  submodulo?: string;
  filhos?: ItemMenu[];
}

const itensMenu: ItemMenu[] = [
  {
    titulo: "Dashboard",
    icone: <Dashboard />,
    rota: "/app/dashboard",
    modulo: "dashboard",
  },
  {
    titulo: "Cadastros",
    icone: <People />,
    modulo: "cadastro",
    filhos: [
      {
        titulo: "Clientes",
        icone: <PersonAdd />,
        rota: "/app/cadastro/clientes",
        modulo: "cadastro",
        submodulo: "clientes",
      },
      {
        titulo: "Produtos",
        icone: <Inventory />,
        rota: "/app/cadastro/produtos",
        modulo: "cadastro",
        submodulo: "produtos",
      },
      {
        titulo: "Fornecedores",
        icone: <Store />,
        rota: "/app/cadastro/fornecedores",
        modulo: "cadastro",
        submodulo: "fornecedores",
      },
      {
        titulo: "Categorias",
        icone: <Category />,
        rota: "/app/cadastro/categorias",
        modulo: "cadastro",
        submodulo: "categorias",
      },
      {
        titulo: "Formulário Dinâmico (Teste)",
        icone: <DynamicForm />,
        rota: "/app/cadastro/exemplo-formulario",
        modulo: "cadastro",
        submodulo: "testes",
      },
      {
        titulo: "Gerenciamento de Arquivos",
        icone: <Folder />,
        rota: "/app/cadastro/gerenciamento-arquivos",
        modulo: "cadastro",
        submodulo: "testes",
      },
    ],
  },
  {
    titulo: "Pedidos",
    icone: <ShoppingCart />,
    rota: "/app/pedidos",
    modulo: "pedidos",
  },
  {
    titulo: "Financeiro",
    icone: <AttachMoney />,
    modulo: "financeiro",
    filhos: [
      {
        titulo: "Contas a Pagar",
        icone: <Receipt />,
        rota: "/app/financeiro/contas-pagar",
        modulo: "financeiro",
        submodulo: "contas-pagar",
      },
      {
        titulo: "Contas a Receber",
        icone: <AccountBalance />,
        rota: "/app/financeiro/contas-receber",
        modulo: "financeiro",
        submodulo: "contas-receber",
      },
    ],
  },
  {
    titulo: "Relatórios",
    icone: <Assessment />,
    modulo: "relatorios",
    filhos: [
      {
        titulo: "Vendas",
        icone: <Assessment />,
        rota: "/app/relatorios/vendas",
        modulo: "relatorios",
        submodulo: "vendas",
      },
      {
        titulo: "Estoque",
        icone: <Inventory />,
        rota: "/app/relatorios/estoque",
        modulo: "relatorios",
        submodulo: "estoque",
      },
    ],
  },
  {
    titulo: "Configurações",
    icone: <Settings />,
    rota: "/app/configuracoes",
    modulo: "configuracoes",
  },
];

export default function MenuLateral() {
  const [itensAbertos, setItensAbertos] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { temPermissao } = useAuth();

  const toggleItem = (titulo: string) => {
    setItensAbertos((prev) => ({ ...prev, [titulo]: !prev[titulo] }));
  };

  const handleNavegar = (rota: string) => {
    navigate(rota);
  };

  const renderItem = (item: ItemMenu, nivel = 0) => {
    const temPermissaoItem = temPermissao(item.modulo, item.submodulo);

    if (!temPermissaoItem) {
      return null;
    }

    const temFilhos = item.filhos && item.filhos.length > 0;
    const estaAberto = itensAbertos[item.titulo] || false;
    const estaSelecionado = item.rota ? location.pathname === item.rota : false;

    return (
      <div key={item.titulo}>
        <ListItemButton
          selected={estaSelecionado}
          onClick={() => {
            if (temFilhos) {
              toggleItem(item.titulo);
            } else if (item.rota) {
              handleNavegar(item.rota);
            }
          }}
          sx={{ pl: 2 + nivel * 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icone}</ListItemIcon>
          <ListItemText primary={item.titulo} />
          {temFilhos && (estaAberto ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {temFilhos && (
          <Collapse in={estaAberto} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.filhos!.map((filho) => renderItem(filho, nivel + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <List component="nav">
      {itensMenu.map((item, index) => (
        <div key={item.titulo}>
          {renderItem(item)}
          {index < itensMenu.length - 1 && item.titulo === "Relatórios" && (
            <Divider sx={{ my: 1 }} />
          )}
        </div>
      ))}
    </List>
  );
}
