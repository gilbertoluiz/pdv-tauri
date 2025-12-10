import { ReactNode, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  FormControl,
  Select,
  Switch,
  Drawer,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout,
  Settings,
  ChevronLeft,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";

interface LayoutPrincipalProps {
  children: ReactNode;
  titulo?: string;
  esquemaCor: string;
  setEsquemaCor: (cor: string) => void;
  escuro: boolean;
  setEscuro: (escuro: boolean) => void;
  coresDisponiveis: Record<string, { primaria: string; secundaria: string }>;
}

const LARGURA_DRAWER = 280;

export default function LayoutPrincipal({
  children,
  titulo,
  esquemaCor,
  setEsquemaCor,
  escuro,
  setEscuro,
  coresDisponiveis,
}: LayoutPrincipalProps) {
  const [drawerAberto, setDrawerAberto] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuUsuario = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFecharMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleFecharMenu();
  };

  const handleConfiguracoes = () => {
    navigate("/app/configuracoes");
    handleFecharMenu();
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerAberto(!drawerAberto)}
            sx={{ mr: 2 }}
          >
            {drawerAberto ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {titulo || "PDV Suite"}
          </Typography>

          {/* Seletor de Tema */}
          <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
            <Select
              value={esquemaCor}
              onChange={(e) => setEsquemaCor(e.target.value)}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.7)",
                },
              }}
            >
              {Object.keys(coresDisponiveis).map((chave) => (
                <MenuItem key={chave} value={chave}>
                  {chave.charAt(0).toUpperCase() + chave.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Switch Modo Escuro */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Escuro
            </Typography>
            <Switch checked={escuro} onChange={(e) => setEscuro(e.target.checked)} />
          </Box>

          {/* Menu do Usuário */}
          <IconButton color="inherit" onClick={handleMenuUsuario}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
              {usuario?.nome.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFecharMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">{usuario?.nome}</Typography>
              <Typography variant="caption" color="text.secondary">
                {usuario?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleConfiguracoes}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configurações
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral */}
      <Drawer
        variant="permanent"
        open={drawerAberto}
        sx={{
          width: drawerAberto ? LARGURA_DRAWER : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerAberto ? LARGURA_DRAWER : 0,
            boxSizing: "border-box",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 1 }}>
          <MenuLateral />
        </Box>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
