import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import FormularioDinamico from "../../components/FormularioDinamico";
import { DefinicaoCampo, DadosFormulario } from "../../types/formulario";
import { DatabaseService, Cliente } from "../../services/database";

export default function TelaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const camposFormulario: DefinicaoCampo[] = [
    {
      nome: "nome",
      label: "Nome/Razão Social",
      tipo: "text",
      obrigatorio: true,
      larguraGrid: 12,
    },
    {
      nome: "email",
      label: "E-mail",
      tipo: "email",
      larguraGrid: 6,
    },
    {
      nome: "telefone",
      label: "Telefone",
      tipo: "phone",
      larguraGrid: 6,
    },
    {
      nome: "cpf",
      label: "CPF",
      tipo: "cpf",
      larguraGrid: 6,
    },
    {
      nome: "cnpj",
      label: "CNPJ",
      tipo: "cnpj",
      larguraGrid: 6,
      dica: "Apenas para pessoa jurídica",
    },
    {
      nome: "endereco",
      label: "Endereço",
      tipo: "text",
      larguraGrid: 12,
    },
    {
      nome: "cidade",
      label: "Cidade",
      tipo: "text",
      larguraGrid: 6,
    },
    {
      nome: "estado",
      label: "Estado",
      tipo: "select",
      opcoes: [
        { value: "", label: "Selecione..." },
        { value: "AC", label: "Acre" },
        { value: "AL", label: "Alagoas" },
        { value: "AP", label: "Amapá" },
        { value: "AM", label: "Amazonas" },
        { value: "BA", label: "Bahia" },
        { value: "CE", label: "Ceará" },
        { value: "DF", label: "Distrito Federal" },
        { value: "ES", label: "Espírito Santo" },
        { value: "GO", label: "Goiás" },
        { value: "MA", label: "Maranhão" },
        { value: "MT", label: "Mato Grosso" },
        { value: "MS", label: "Mato Grosso do Sul" },
        { value: "MG", label: "Minas Gerais" },
        { value: "PA", label: "Pará" },
        { value: "PB", label: "Paraíba" },
        { value: "PR", label: "Paraná" },
        { value: "PE", label: "Pernambuco" },
        { value: "PI", label: "Piauí" },
        { value: "RJ", label: "Rio de Janeiro" },
        { value: "RN", label: "Rio Grande do Norte" },
        { value: "RS", label: "Rio Grande do Sul" },
        { value: "RO", label: "Rondônia" },
        { value: "RR", label: "Roraima" },
        { value: "SC", label: "Santa Catarina" },
        { value: "SP", label: "São Paulo" },
        { value: "SE", label: "Sergipe" },
        { value: "TO", label: "Tocantins" },
      ],
      larguraGrid: 6,
    },
    {
      nome: "ativo",
      label: "Cliente Ativo",
      tipo: "checkbox",
      valorPadrao: true,
      larguraGrid: 12,
    },
  ];

  useEffect(() => {
    carregarClientes();
    // Initialize tables on first load
    DatabaseService.inicializarTabelas().catch((err) => {
      console.error("Erro ao inicializar tabelas:", err);
    });
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await DatabaseService.listarClientes();
      setClientes(dados);
    } catch (error) {
      setErro("Erro ao carregar clientes: " + String(error));
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovo = () => {
    setClienteEditando(null);
    setDialogAberto(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setClienteEditando(null);
  };

  const handleSalvar = async (dados: DadosFormulario) => {
    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      const cliente: Cliente = {
        nome: dados.nome as string,
        email: dados.email as string,
        telefone: dados.telefone as string,
        cpf: dados.cpf as string,
        cnpj: dados.cnpj as string,
        endereco: dados.endereco as string,
        cidade: dados.cidade as string,
        estado: dados.estado as string,
        ativo: dados.ativo as boolean,
      };

      if (clienteEditando?.id) {
        await DatabaseService.atualizarCliente(clienteEditando.id, cliente);
        setSucesso("Cliente atualizado com sucesso!");
      } else {
        await DatabaseService.criarCliente(cliente);
        setSucesso("Cliente criado com sucesso!");
      }

      handleFecharDialog();
      await carregarClientes();
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      setErro("Erro ao salvar cliente: " + String(error));
      console.error(error);
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) {
      return;
    }

    try {
      setErro("");
      await DatabaseService.excluirCliente(id);
      setSucesso("Cliente excluído com sucesso!");
      await carregarClientes();
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      setErro("Erro ao excluir cliente: " + String(error));
      console.error(error);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie seus clientes
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleNovo}>
          Novo Cliente
        </Button>
      </Stack>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErro("")}>
          {erro}
        </Alert>
      )}

      {sucesso && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSucesso("")}>
          {sucesso}
        </Alert>
      )}

      <Paper sx={{ p: 0 }}>
        {carregando ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : clientes.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>CPF/CNPJ</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.cpf || cliente.cnpj}</TableCell>
                    <TableCell>{cliente.cidade}</TableCell>
                    <TableCell>
                      {cliente.ativo ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Ativo"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<Cancel />}
                          label="Inativo"
                          color="default"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEditar(cliente)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleExcluir(cliente.id!)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog para criar/editar */}
      <Dialog open={dialogAberto} onClose={handleFecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {clienteEditando ? "Editar Cliente" : "Novo Cliente"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormularioDinamico
              campos={camposFormulario}
              modo={clienteEditando ? "editar" : "criar"}
              dadosIniciais={clienteEditando || {}}
              aoSalvar={handleSalvar}
              aoCancelar={handleFecharDialog}
              salvando={salvando}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
