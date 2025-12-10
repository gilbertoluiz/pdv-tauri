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
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import FormularioDinamico from "../../components/FormularioDinamico";
import DialogoConfirmacao from "../../components/DialogoConfirmacao";
import { DefinicaoCampo, DadosFormulario } from "../../types/formulario";
import { DatabaseService, Produto } from "../../services/database";

export default function TelaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [dialogExcluirAberto, setDialogExcluirAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [produtoExcluindo, setProdutoExcluindo] = useState<Produto | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const camposFormulario: DefinicaoCampo[] = [
    {
      nome: "codigo",
      label: "Código",
      tipo: "text",
      obrigatorio: true,
      larguraGrid: 4,
    },
    {
      nome: "nome",
      label: "Nome do Produto",
      tipo: "text",
      obrigatorio: true,
      larguraGrid: 8,
    },
    {
      nome: "descricao",
      label: "Descrição",
      tipo: "textarea",
      linhas: 3,
      larguraGrid: 12,
    },
    {
      nome: "categoria",
      label: "Categoria",
      tipo: "select",
      obrigatorio: true,
      opcoes: [
        { value: "", label: "Selecione..." },
        { value: "eletronicos", label: "Eletrônicos" },
        { value: "alimentos", label: "Alimentos" },
        { value: "vestuario", label: "Vestuário" },
        { value: "higiene", label: "Higiene e Limpeza" },
        { value: "bebidas", label: "Bebidas" },
        { value: "outros", label: "Outros" },
      ],
      larguraGrid: 6,
    },
    {
      nome: "unidade",
      label: "Unidade",
      tipo: "select",
      obrigatorio: true,
      opcoes: [
        { value: "", label: "Selecione..." },
        { value: "UN", label: "Unidade" },
        { value: "KG", label: "Quilograma" },
        { value: "L", label: "Litro" },
        { value: "M", label: "Metro" },
        { value: "CX", label: "Caixa" },
        { value: "PC", label: "Pacote" },
      ],
      larguraGrid: 6,
    },
    {
      nome: "preco_custo",
      label: "Preço de Custo",
      tipo: "money",
      min: 0,
      larguraGrid: 4,
    },
    {
      nome: "preco_venda",
      label: "Preço de Venda",
      tipo: "money",
      obrigatorio: true,
      min: 0,
      larguraGrid: 4,
    },
    {
      nome: "estoque",
      label: "Estoque Atual",
      tipo: "number",
      valorPadrao: 0,
      min: 0,
      larguraGrid: 4,
    },
    {
      nome: "estoque_minimo",
      label: "Estoque Mínimo",
      tipo: "number",
      valorPadrao: 0,
      min: 0,
      larguraGrid: 6,
    },
    {
      nome: "data_validade",
      label: "Data de Validade",
      tipo: "date",
      larguraGrid: 6,
      dica: "Opcional - apenas para produtos perecíveis",
    },
    {
      nome: "ativo",
      label: "Produto Ativo",
      tipo: "checkbox",
      valorPadrao: true,
      larguraGrid: 12,
    },
  ];

  useEffect(() => {
    carregarProdutos();
    // Initialize tables on first load
    DatabaseService.inicializarTabelas().catch((err) => {
      console.error("Erro ao inicializar tabelas:", err);
    });
  }, []);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await DatabaseService.listarProdutos();
      setProdutos(dados);
    } catch (error) {
      setErro("Erro ao carregar produtos: " + String(error));
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovo = () => {
    setProdutoEditando(null);
    setDialogAberto(true);
  };

  const handleEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setProdutoEditando(null);
  };

  const handleSalvar = async (dados: DadosFormulario) => {
    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      const produto: Produto = {
        codigo: dados.codigo as string,
        nome: dados.nome as string,
        descricao: dados.descricao as string,
        categoria: dados.categoria as string,
        unidade: dados.unidade as string,
        preco_custo: dados.preco_custo as number,
        preco_venda: dados.preco_venda as number,
        estoque: dados.estoque as number,
        estoque_minimo: dados.estoque_minimo as number,
        data_validade: dados.data_validade as string,
        ativo: dados.ativo as boolean,
      };

      if (produtoEditando?.id) {
        await DatabaseService.atualizarProduto(produtoEditando.id, produto);
        setSucesso("Produto atualizado com sucesso!");
      } else {
        await DatabaseService.criarProduto(produto);
        setSucesso("Produto criado com sucesso!");
      }

      handleFecharDialog();
      await carregarProdutos();
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      setErro("Erro ao salvar produto: " + String(error));
      console.error(error);
    } finally {
      setSalvando(false);
    }
  };

  const handleAbrirDialogoExcluir = (produto: Produto) => {
    setProdutoExcluindo(produto);
    setDialogExcluirAberto(true);
  };

  const handleFecharDialogoExcluir = () => {
    setDialogExcluirAberto(false);
    setProdutoExcluindo(null);
  };

  const handleConfirmarExcluir = async () => {
    if (!produtoExcluindo?.id) return;

    try {
      setErro("");
      await DatabaseService.excluirProduto(produtoExcluindo.id);
      setSucesso("Produto excluído com sucesso!");
      await carregarProdutos();
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      setErro("Erro ao excluir produto: " + String(error));
      console.error(error);
    } finally {
      handleFecharDialogoExcluir();
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Produtos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie seu catálogo de produtos
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleNovo}>
          Novo Produto
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
        ) : produtos.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell align="right">Preço Venda</TableCell>
                  <TableCell align="right">Estoque</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>{produto.codigo}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell align="right">
                      {formatarMoeda(produto.preco_venda)}
                    </TableCell>
                    <TableCell align="right">
                      {produto.estoque} {produto.unidade}
                    </TableCell>
                    <TableCell>
                      {produto.ativo ? (
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
                        onClick={() => handleEditar(produto)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleAbrirDialogoExcluir(produto)}
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
          {produtoEditando ? "Editar Produto" : "Novo Produto"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormularioDinamico
              campos={camposFormulario}
              modo={produtoEditando ? "editar" : "criar"}
              dadosIniciais={produtoEditando || {}}
              aoSalvar={handleSalvar}
              aoCancelar={handleFecharDialog}
              salvando={salvando}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <DialogoConfirmacao
        aberto={dialogExcluirAberto}
        titulo="Excluir Produto"
        mensagem={`Tem certeza que deseja excluir o produto "${produtoExcluindo?.nome}" (Código: ${produtoExcluindo?.codigo})? Esta ação não pode ser desfeita.`}
        onConfirmar={handleConfirmarExcluir}
        onCancelar={handleFecharDialogoExcluir}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
        corConfirmar="error"
      />
    </Box>
  );
}
