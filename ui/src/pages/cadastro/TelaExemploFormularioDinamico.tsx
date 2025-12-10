import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import FormularioDinamico from "../../components/FormularioDinamico";
import { DefinicaoCampo, DadosFormulario } from "../../types/formulario";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TelaExemploFormularioDinamico() {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");

  // Example 1: Simple contact form
  const camposContato: DefinicaoCampo[] = [
    {
      nome: "nome",
      label: "Nome Completo",
      tipo: "text",
      obrigatorio: true,
      placeholder: "Digite seu nome",
      larguraGrid: 12,
      validacoes: [
        {
          tipo: "minLength",
          valor: 3,
          mensagem: "Nome deve ter pelo menos 3 caracteres",
        },
      ],
    },
    {
      nome: "email",
      label: "E-mail",
      tipo: "email",
      obrigatorio: true,
      placeholder: "seu@email.com",
      larguraGrid: 6,
    },
    {
      nome: "telefone",
      label: "Telefone",
      tipo: "phone",
      obrigatorio: true,
      placeholder: "(00) 00000-0000",
      larguraGrid: 6,
    },
    {
      nome: "mensagem",
      label: "Mensagem",
      tipo: "textarea",
      obrigatorio: true,
      linhas: 4,
      larguraGrid: 12,
      dica: "Digite sua mensagem aqui",
    },
    {
      nome: "aceiteTermos",
      label: "Aceito os termos e condições",
      tipo: "checkbox",
      obrigatorio: true,
      larguraGrid: 12,
    },
  ];

  // Example 2: Client registration with documents
  const camposCliente: DefinicaoCampo[] = [
    {
      nome: "tipoPessoa",
      label: "Tipo de Pessoa",
      tipo: "select",
      obrigatorio: true,
      valorPadrao: "fisica",
      opcoes: [
        { value: "fisica", label: "Pessoa Física" },
        { value: "juridica", label: "Pessoa Jurídica" },
      ],
      larguraGrid: 12,
    },
    {
      nome: "nome",
      label: "Nome/Razão Social",
      tipo: "text",
      obrigatorio: true,
      larguraGrid: 12,
    },
    {
      nome: "cpf",
      label: "CPF",
      tipo: "cpf",
      obrigatorio: true,
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
      nome: "email",
      label: "E-mail",
      tipo: "email",
      obrigatorio: true,
      larguraGrid: 6,
    },
    {
      nome: "telefone",
      label: "Telefone",
      tipo: "phone",
      obrigatorio: true,
      larguraGrid: 6,
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
        { value: "SP", label: "São Paulo" },
        { value: "RJ", label: "Rio de Janeiro" },
        { value: "MG", label: "Minas Gerais" },
        { value: "RS", label: "Rio Grande do Sul" },
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

  // Example 3: Product registration with pricing
  const camposProduto: DefinicaoCampo[] = [
    {
      nome: "nome",
      label: "Nome do Produto",
      tipo: "text",
      obrigatorio: true,
      larguraGrid: 8,
    },
    {
      nome: "codigo",
      label: "Código",
      tipo: "text",
      obrigatorio: true,
      larguraGrid: 4,
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
        { value: "eletronicos", label: "Eletrônicos" },
        { value: "alimentos", label: "Alimentos" },
        { value: "vestuario", label: "Vestuário" },
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
        { value: "UN", label: "Unidade" },
        { value: "KG", label: "Quilograma" },
        { value: "L", label: "Litro" },
        { value: "M", label: "Metro" },
      ],
      larguraGrid: 6,
    },
    {
      nome: "precoCusto",
      label: "Preço de Custo",
      tipo: "money",
      obrigatorio: true,
      min: 0,
      larguraGrid: 4,
    },
    {
      nome: "precoVenda",
      label: "Preço de Venda",
      tipo: "money",
      obrigatorio: true,
      min: 0,
      larguraGrid: 4,
    },
    {
      nome: "estoque",
      label: "Estoque Inicial",
      tipo: "number",
      valorPadrao: 0,
      min: 0,
      larguraGrid: 4,
    },
    {
      nome: "estoqueMinimo",
      label: "Estoque Mínimo",
      tipo: "number",
      valorPadrao: 0,
      min: 0,
      larguraGrid: 6,
    },
    {
      nome: "dataValidade",
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

  const handleSalvar = async (dados: DadosFormulario) => {
    try {
      setSalvando(true);
      setSucesso("");
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Dados salvos:", dados);
      setSucesso("Dados salvos com sucesso!");
      
      // Reset success message after 3 seconds
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Exemplos de Formulário Dinâmico
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Demonstração do sistema de formulários dinâmicos com validação automática
      </Typography>

      {sucesso && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {sucesso}
        </Alert>
      )}

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabAtiva}
          onChange={(_, newValue) => setTabAtiva(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Formulário de Contato" />
          <Tab label="Cadastro de Cliente" />
          <Tab label="Cadastro de Produto" />
        </Tabs>

        <TabPanel value={tabAtiva} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Formulário de Contato
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Exemplo com campos de texto, e-mail, telefone e checkbox
            </Typography>
            <FormularioDinamico
              campos={camposContato}
              modo="criar"
              aoSalvar={handleSalvar}
              salvando={salvando}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabAtiva} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cadastro de Cliente
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Exemplo com validação de CPF/CNPJ, e-mail e telefone
            </Typography>
            <FormularioDinamico
              campos={camposCliente}
              modo="criar"
              aoSalvar={handleSalvar}
              salvando={salvando}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabAtiva} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cadastro de Produto
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Exemplo com campos de moeda, número, data e seleção
            </Typography>
            <FormularioDinamico
              campos={camposProduto}
              modo="criar"
              aoSalvar={handleSalvar}
              salvando={salvando}
            />
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
