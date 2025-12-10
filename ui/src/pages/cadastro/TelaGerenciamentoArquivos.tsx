import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function TelaGerenciamentoArquivos() {
  // State for generating TXT
  const [caminhoGerar, setCaminhoGerar] = useState("");
  const [conteudoGerar, setConteudoGerar] = useState("Hello World!");
  const [gerando, setGerando] = useState(false);
  const [erroGerar, setErroGerar] = useState("");
  const [sucessoGerar, setSucessoGerar] = useState("");

  // State for reading files
  const [caminhoLer, setCaminhoLer] = useState("");
  const [conteudoLido, setConteudoLido] = useState("");
  const [lendo, setLendo] = useState(false);
  const [erroLer, setErroLer] = useState("");

  // State for listing files
  const [diretorioListar, setDiretorioListar] = useState("");
  const [extensaoFiltro, setExtensaoFiltro] = useState("");
  const [arquivosListados, setArquivosListados] = useState<string[]>([]);
  const [listando, setListando] = useState(false);
  const [erroListar, setErroListar] = useState("");

  const handleGerarTxt = async () => {
    if (!caminhoGerar) {
      setErroGerar("Por favor, informe o caminho do arquivo");
      return;
    }

    try {
      setErroGerar("");
      setSucessoGerar("");
      setGerando(true);
      const mensagem = await invoke<string>("gerar_txt", {
        caminho: caminhoGerar,
        conteudo: conteudoGerar,
      });
      setSucessoGerar(mensagem);
    } catch (e) {
      setErroGerar("Erro ao gerar arquivo: " + e);
    } finally {
      setGerando(false);
    }
  };

  const handleLerArquivo = async () => {
    if (!caminhoLer) {
      setErroLer("Por favor, informe o caminho do arquivo");
      return;
    }

    try {
      setErroLer("");
      setConteudoLido("");
      setLendo(true);
      const conteudo = await invoke<string>("ler_arquivo", {
        caminho: caminhoLer,
      });
      setConteudoLido(conteudo);
    } catch (e) {
      setErroLer("Erro ao ler arquivo: " + e);
    } finally {
      setLendo(false);
    }
  };

  const handleListarArquivos = async () => {
    if (!diretorioListar) {
      setErroListar("Por favor, informe o diretório");
      return;
    }

    try {
      setErroListar("");
      setArquivosListados([]);
      setListando(true);
      const arquivos = await invoke<string[]>("listar_arquivos_diretorio", {
        caminho: diretorioListar,
        extensao: extensaoFiltro || null,
      });
      setArquivosListados(arquivos);
    } catch (e) {
      setErroListar("Erro ao listar arquivos: " + e);
    } finally {
      setListando(false);
    }
  };

  const handleLerArquivoLista = async (caminho: string) => {
    setCaminhoLer(caminho);
    try {
      setErroLer("");
      setConteudoLido("");
      setLendo(true);
      const conteudo = await invoke<string>("ler_arquivo", {
        caminho: caminho,
      });
      setConteudoLido(conteudo);
    } catch (e) {
      setErroLer("Erro ao ler arquivo: " + e);
    } finally {
      setLendo(false);
    }
  };

  const gerarHelloWorld = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
    setCaminhoGerar(`C:\\temp\\hello_${timestamp}.txt`);
    setConteudoGerar("Hello World!\nArquivo gerado em: " + new Date().toLocaleString());
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Gerenciamento de Arquivos
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Sistema de geração e leitura de arquivos TXT e XML
      </Typography>

      {/* Section 1: Generate TXT */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gerar Arquivo TXT
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Crie arquivos de texto em qualquer local do sistema
        </Typography>

        {erroGerar && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erroGerar}
          </Alert>
        )}

        {sucessoGerar && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {sucessoGerar}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Caminho Completo do Arquivo"
            value={caminhoGerar}
            onChange={(e) => setCaminhoGerar(e.target.value)}
            fullWidth
            placeholder="C:\temp\arquivo.txt"
            helperText="Exemplo: C:\temp\arquivo.txt ou /tmp/arquivo.txt"
          />
          <TextField
            label="Conteúdo do Arquivo"
            value={conteudoGerar}
            onChange={(e) => setConteudoGerar(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Digite o conteúdo..."
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleGerarTxt}
              disabled={gerando}
              startIcon={gerando ? <CircularProgress size={20} /> : <DescriptionIcon />}
            >
              {gerando ? "Gerando..." : "Gerar Arquivo"}
            </Button>
            <Button variant="outlined" onClick={gerarHelloWorld}>
              Exemplo: Hello World
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Section 2: Read File */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ler Arquivo (TXT/XML)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Leia o conteúdo de arquivos de texto ou XML
        </Typography>

        {erroLer && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erroLer}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Caminho Completo do Arquivo"
            value={caminhoLer}
            onChange={(e) => setCaminhoLer(e.target.value)}
            fullWidth
            placeholder="C:\temp\arquivo.txt ou C:\retornos\arquivo.xml"
          />
          <Button
            variant="contained"
            onClick={handleLerArquivo}
            disabled={lendo}
            startIcon={lendo ? <CircularProgress size={20} /> : <DescriptionIcon />}
          >
            {lendo ? "Lendo..." : "Ler Arquivo"}
          </Button>

          {conteudoLido && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Conteúdo do Arquivo:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.100",
                  maxHeight: 300,
                  overflow: "auto",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                }}
              >
                {conteudoLido}
              </Paper>
            </Box>
          )}
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Section 3: List Files in Directory */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Listar Arquivos de Retorno
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Liste arquivos XML ou TXT em um diretório para processamento
        </Typography>

        {erroListar && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erroListar}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Diretório"
            value={diretorioListar}
            onChange={(e) => setDiretorioListar(e.target.value)}
            fullWidth
            placeholder="C:\retornos"
            helperText="Diretório onde estão os arquivos de retorno"
          />
          <TextField
            label="Extensão (Opcional)"
            value={extensaoFiltro}
            onChange={(e) => setExtensaoFiltro(e.target.value)}
            placeholder="xml ou txt"
            helperText="Deixe em branco para listar todos os arquivos"
          />
          <Button
            variant="contained"
            onClick={handleListarArquivos}
            disabled={listando}
            startIcon={listando ? <CircularProgress size={20} /> : <FolderIcon />}
          >
            {listando ? "Listando..." : "Listar Arquivos"}
          </Button>

          {arquivosListados.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Arquivos encontrados: {arquivosListados.length}
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
                <List>
                  {arquivosListados.map((arquivo, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleLerArquivoLista(arquivo)}
                          title="Ler arquivo"
                        >
                          <DescriptionIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={arquivo.split(/[\\/]/).pop()}
                        secondary={arquivo}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {arquivosListados.length === 0 && !listando && !erroListar && diretorioListar && (
            <Alert severity="info">
              Nenhum arquivo encontrado no diretório especificado
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Usage Guide */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: "info.light" }}>
        <Typography variant="h6" gutterBottom>
          Como Utilizar
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Geração de Arquivos:</strong>
          <ul>
            <li>Informe o caminho completo onde deseja criar o arquivo</li>
            <li>Digite o conteúdo desejado (pode ser multi-linha)</li>
            <li>Clique em "Gerar Arquivo"</li>
            <li>O sistema criará os diretórios automaticamente se não existirem</li>
          </ul>

          <strong>Leitura de Arquivos:</strong>
          <ul>
            <li>Informe o caminho completo do arquivo a ser lido</li>
            <li>Funciona com arquivos TXT e XML</li>
            <li>O conteúdo será exibido na tela</li>
          </ul>

          <strong>Listagem de Arquivos de Retorno:</strong>
          <ul>
            <li>Informe o diretório onde estão os arquivos de retorno</li>
            <li>Opcionalmente filtre por extensão (xml ou txt)</li>
            <li>Clique no ícone ao lado do arquivo para ler seu conteúdo</li>
            <li>Útil para processar arquivos de retorno do Unimake ou outros sistemas</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
}
