import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

interface Config {
  servidorIp: string;
  usuarioBanco: string;
  senhaBanco: string;
  porta: number;
  nomeBanco: string;
}

export default function TelaConfiguracaoBanco() {
  const [config, setConfig] = useState<Config>({
    servidorIp: "127.0.0.1",
    usuarioBanco: "root",
    senhaBanco: "",
    porta: 3306,
    nomeBanco: "pdv",
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [testando, setTestando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [dialogExcluir, setDialogExcluir] = useState(false);

  useEffect(() => {
    carregarConfiguracao();
  }, []);

  const carregarConfiguracao = async () => {
    try {
      setCarregando(true);
      const cfg = await invoke<Config>("obter_configuracao");
      setConfig(cfg);
    } catch (e) {
      setErro("Erro ao carregar configuração: " + e);
    } finally {
      setCarregando(false);
    }
  };

  const testarConexao = async () => {
    try {
      setErro("");
      setSucesso("");
      setTestando(true);
      const mensagem = await invoke<string>("testar_conexao", {
        servidorIp: config.servidorIp,
        usuarioBanco: config.usuarioBanco,
        senhaBanco: config.senhaBanco,
        porta: config.porta,
        nomeBanco: config.nomeBanco,
      });
      setSucesso(mensagem);
    } catch (e) {
      setErro("Falha ao conectar: " + e);
    } finally {
      setTestando(false);
    }
  };

  const salvar = async () => {
    try {
      setErro("");
      setSucesso("");
      setSalvando(true);
      const mensagem = await invoke<string>("salvar_configuracao", {
        servidorIp: config.servidorIp,
        usuarioBanco: config.usuarioBanco,
        senhaBanco: config.senhaBanco,
        porta: config.porta,
        nomeBanco: config.nomeBanco,
      });
      setSucesso(mensagem);
    } catch (e) {
      setErro("Falha ao salvar configuração: " + e);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async () => {
    try {
      setErro("");
      setSucesso("");
      const mensagem = await invoke<string>("excluir_configuracao");
      setSucesso(mensagem);
      setDialogExcluir(false);
      // Reset to defaults
      setConfig({
        servidorIp: "127.0.0.1",
        usuarioBanco: "root",
        senhaBanco: "",
        porta: 3306,
        nomeBanco: "pdv",
      });
    } catch (e) {
      setErro("Erro ao excluir configuração: " + e);
      setDialogExcluir(false);
    }
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuração do Banco de Dados
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Gerencie a conexão com o banco de dados MySQL
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      {sucesso && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {sucesso}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack spacing={2.5}>
          <TextField
            label="IP do Servidor MySQL"
            value={config.servidorIp}
            onChange={(e) => setConfig({ ...config, servidorIp: e.target.value })}
            fullWidth
          />
          <TextField
            label="Porta"
            type="number"
            value={config.porta}
            onChange={(e) => setConfig({ ...config, porta: Number(e.target.value) })}
            fullWidth
          />
          <TextField
            label="Nome do Banco de Dados"
            value={config.nomeBanco}
            onChange={(e) => setConfig({ ...config, nomeBanco: e.target.value })}
            fullWidth
          />
          <TextField
            label="Usuário do Banco"
            value={config.usuarioBanco}
            onChange={(e) => setConfig({ ...config, usuarioBanco: e.target.value })}
            fullWidth
          />
          <TextField
            label="Senha do Banco"
            type="password"
            value={config.senhaBanco}
            onChange={(e) => setConfig({ ...config, senhaBanco: e.target.value })}
            fullWidth
          />
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={testarConexao}
          disabled={testando || salvando}
        >
          {testando ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Testando...
            </>
          ) : (
            "Testar Conexão"
          )}
        </Button>
        <Button
          variant="contained"
          onClick={salvar}
          disabled={salvando || testando}
        >
          {salvando ? "Salvando..." : "Salvar Configuração"}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDialogExcluir(true)}
          disabled={salvando || testando}
        >
          Excluir Configuração
        </Button>
      </Stack>

      <Dialog open={dialogExcluir} onClose={() => setDialogExcluir(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a configuração do banco de dados? Você precisará
            reconfigurá-la para usar o sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogExcluir(false)}>Cancelar</Button>
          <Button onClick={excluir} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
