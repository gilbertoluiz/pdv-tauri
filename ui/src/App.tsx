import React from "react";
import { invoke } from "@tauri-apps/api";
import { ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Switch, Button, TextField, Box } from "@mui/material";
import { criarTema } from "./tema";

type Pedido = { id: number; documento_cliente: string; status: string; criado_em: string; };

export default function App() {
  const [escuro, setEscuro] = React.useState(false);
  const [configurado, setConfigurado] = React.useState(false);
  const [logado, setLogado] = React.useState(false);
  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);

  const [cfg, setCfg] = React.useState({
    conexao_mysql: "",
    pasta_unimake_envio: "C:\\\\Unimake\\\\UniNFe\\\\<cnpjdocliente>\\\\Envio",
    pasta_unimake_retorno: "C:\\\\Unimake\\\\UniNFe\\\\<cnpjdocliente>\\\\Retorno",
    contingencia_offline: true,
    tef_habilitado: true,
    endereco_impressora: ""
  });

  const salvar = async () => {
    await invoke("salvar_configuracao", { cfg });
    setConfigurado(true);
  };

  const entrar = async () => {
    const ok = await invoke<boolean>("entrar", { usuario: "admin", senha: "admin" });
    setLogado(ok);
    if (ok) {
      const lista = await invoke<Pedido[]>("listar_pedidos");
      setPedidos(lista);
    }
  };

  return (
    <ThemeProvider theme={criarTema(escuro)}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>PDV Suite</Typography>
          Tema escuro <Switch checked={escuro} onChange={e => setEscuro(e.target.checked)} />
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {!configurado && (
          <Box maxWidth={640}>
            <Typography variant="h5">Configuração Inicial</Typography>
            <TextField label="MySQL 5.5" fullWidth margin="normal"
              value={cfg.conexao_mysql} onChange={e => setCfg({ ...cfg, conexao_mysql: e.target.value })}/>
            <TextField label="Unimake Envio" fullWidth margin="normal"
              value={cfg.pasta_unimake_envio} onChange={e => setCfg({ ...cfg, pasta_unimake_envio: e.target.value })}/>
            <TextField label="Unimake Retorno" fullWidth margin="normal"
              value={cfg.pasta_unimake_retorno} onChange={e => setCfg({ ...cfg, pasta_unimake_retorno: e.target.value })}/>
            <Button variant="contained" onClick={salvar}>Salvar e continuar</Button>
          </Box>
        )}

        {configurado && !logado && (
          <Box maxWidth={420}>
            <Typography variant="h5">Login</Typography>
            <TextField label="Usuário" fullWidth margin="normal"/>
            <TextField label="Senha" type="password" fullWidth margin="normal"/>
            <Button variant="contained" onClick={entrar}>Entrar</Button>
          </Box>
        )}

        {configurado && logado && (
          <Box>
            <Typography variant="h5" gutterBottom>Pedidos</Typography>
            <Button variant="contained" onClick={() => {
              const novo = { id: pedidos.length + 1, documento_cliente: "123", status: "Rascunho", criado_em: new Date().toISOString() };
              setPedidos([...pedidos, novo]);
            }}>Novo Pedido</Button>
            <Box mt={2}>
              {pedidos.map(p => (
                <Box key={p.id} display="flex" gap={2} alignItems="center" py={1} borderBottom="1px solid #4444">
                  <div>ID: {p.id}</div>
                  <div>Cliente: {p.documento_cliente}</div>
                  <div>Status: {p.status}</div>
                  <Button size="small" onClick={() => {
                    setPedidos(pedidos.map(x => x.id === p.id ? { ...x, status: "ProntoFiscal" } : x));
                  }}>Pronto p/ Fiscal</Button>
                  <Button color="error" size="small" onClick={() => setPedidos(pedidos.filter(x => x.id !== p.id))}>Excluir</Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}