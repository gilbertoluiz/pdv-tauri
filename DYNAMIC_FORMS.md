# Dynamic Form System - Documentation

## Overview

The PDV Suite now includes a powerful dynamic form system that automatically creates forms based on field definitions. This system includes automatic validation, formatting for Brazilian documents (CPF, CNPJ), phone numbers, currency values, and more.

## Features

### 1. Database Configuration Management

The system now validates database connections before saving:

- **Startup Check**: System checks if database is configured on startup
- **Connection Testing**: Test connection before saving configuration
- **CRUD Operations**: Create, read, update, and delete database configurations
- **Automatic Validation**: Connection must be valid before configuration is saved

### 2. Dynamic Form System

Create complex forms by simply defining field configurations:

```typescript
import FormularioDinamico from "../components/FormularioDinamico";
import { DefinicaoCampo } from "../types/formulario";

const campos: DefinicaoCampo[] = [
  {
    nome: "nome",
    label: "Nome Completo",
    tipo: "text",
    obrigatorio: true,
    larguraGrid: 12
  },
  {
    nome: "email",
    label: "E-mail",
    tipo: "email",
    obrigatorio: true,
    larguraGrid: 6
  },
  // ... more fields
];

<FormularioDinamico
  campos={campos}
  modo="criar"
  aoSalvar={handleSalvar}
/>
```

## Field Types

### Basic Fields
- **text**: Regular text input
- **number**: Numeric input with min/max validation
- **email**: Email input with validation
- **password**: Password input
- **textarea**: Multi-line text input
- **url**: URL input with validation
- **date**: Date picker
- **datetime**: Date and time picker
- **checkbox**: Boolean checkbox
- **select**: Dropdown selection

### Brazilian Specific Fields
- **cpf**: CPF input with automatic formatting (XXX.XXX.XXX-XX) and validation
- **cnpj**: CNPJ input with automatic formatting (XX.XXX.XXX/XXXX-XX) and validation
- **phone**: Brazilian phone number with formatting ((XX) XXXXX-XXXX)
- **cep**: Brazilian postal code (XXXXX-XXX)
- **money**: Currency input with BRL formatting (R$ 0,00)

## Field Definition Properties

```typescript
interface DefinicaoCampo {
  nome: string;              // Field name (used as key in form data)
  label: string;             // Display label
  tipo: TipoCampo;          // Field type
  obrigatorio?: boolean;     // Whether field is required
  placeholder?: string;      // Placeholder text
  valorPadrao?: any;        // Default value
  opcoes?: OpcaoSelect[];   // Options for select fields
  validacoes?: RegraValidacao[]; // Custom validation rules
  desabilitado?: boolean;    // Whether field is disabled
  dica?: string;            // Helper text
  linhas?: number;          // Rows for textarea
  min?: number;             // Min value for number/date
  max?: number;             // Max value for number/date
  larguraGrid?: number;     // Grid width (1-12)
}
```

## Validation Rules

### Built-in Validations
- **obrigatorio**: Field cannot be empty
- **email**: Valid email format
- **cpf**: Valid CPF with check digits
- **cnpj**: Valid CNPJ with check digits
- **phone**: Valid Brazilian phone format
- **url**: Valid URL format
- **minLength**: Minimum text length
- **maxLength**: Maximum text length
- **min**: Minimum numeric value
- **max**: Maximum numeric value

### Custom Validations

```typescript
{
  nome: "senha",
  label: "Senha",
  tipo: "password",
  validacoes: [
    {
      tipo: "custom",
      mensagem: "Senha deve conter pelo menos uma letra maiúscula",
      validador: (valor) => /[A-Z]/.test(valor)
    }
  ]
}
```

## Form Modes

The dynamic form supports three modes:

1. **criar**: Create new record
2. **editar**: Edit existing record
3. **visualizar**: View-only (all fields disabled)

```typescript
<FormularioDinamico
  campos={campos}
  modo="editar"
  dadosIniciais={registro}
  aoSalvar={handleSalvar}
/>
```

## Examples

### Example 1: Contact Form

```typescript
const camposContato: DefinicaoCampo[] = [
  {
    nome: "nome",
    label: "Nome Completo",
    tipo: "text",
    obrigatorio: true,
    larguraGrid: 12
  },
  {
    nome: "email",
    label: "E-mail",
    tipo: "email",
    obrigatorio: true,
    larguraGrid: 6
  },
  {
    nome: "telefone",
    label: "Telefone",
    tipo: "phone",
    obrigatorio: true,
    larguraGrid: 6
  },
  {
    nome: "mensagem",
    label: "Mensagem",
    tipo: "textarea",
    obrigatorio: true,
    linhas: 4,
    larguraGrid: 12
  }
];
```

### Example 2: Client Registration

```typescript
const camposCliente: DefinicaoCampo[] = [
  {
    nome: "nome",
    label: "Nome/Razão Social",
    tipo: "text",
    obrigatorio: true,
    larguraGrid: 12
  },
  {
    nome: "cpf",
    label: "CPF",
    tipo: "cpf",
    obrigatorio: true,
    larguraGrid: 6
  },
  {
    nome: "cnpj",
    label: "CNPJ",
    tipo: "cnpj",
    larguraGrid: 6
  },
  {
    nome: "email",
    label: "E-mail",
    tipo: "email",
    obrigatorio: true,
    larguraGrid: 6
  },
  {
    nome: "telefone",
    label: "Telefone",
    tipo: "phone",
    obrigatorio: true,
    larguraGrid: 6
  }
];
```

### Example 3: Product with Pricing

```typescript
const camposProduto: DefinicaoCampo[] = [
  {
    nome: "nome",
    label: "Nome do Produto",
    tipo: "text",
    obrigatorio: true,
    larguraGrid: 8
  },
  {
    nome: "categoria",
    label: "Categoria",
    tipo: "select",
    obrigatorio: true,
    opcoes: [
      { value: "eletronicos", label: "Eletrônicos" },
      { value: "alimentos", label: "Alimentos" }
    ],
    larguraGrid: 4
  },
  {
    nome: "precoCusto",
    label: "Preço de Custo",
    tipo: "money",
    obrigatorio: true,
    min: 0,
    larguraGrid: 6
  },
  {
    nome: "precoVenda",
    label: "Preço de Venda",
    tipo: "money",
    obrigatorio: true,
    min: 0,
    larguraGrid: 6
  }
];
```

## Utilities

### Validators (`src/utils/validadores.ts`)

- `validarCPF(cpf: string): boolean`
- `validarCNPJ(cnpj: string): boolean`
- `validarEmail(email: string): boolean`
- `validarTelefone(telefone: string): boolean`
- `validarObrigatorio(value: string): boolean`
- `validarTamanhoMinimo(value: string, min: number): boolean`
- `validarTamanhoMaximo(value: string, max: number): boolean`
- `validarIntervalo(value: number, min?: number, max?: number): boolean`
- `validarURL(url: string): boolean`

### Formatters (`src/utils/formatadores.ts`)

- `formatarCPF(cpf: string): string`
- `formatarCNPJ(cnpj: string): string`
- `formatarTelefone(telefone: string): string`
- `formatarCEP(cep: string): string`
- `formatarMoeda(value: number | string): string`
- `parseMoeda(value: string): number`
- `formatarData(date: Date | string): string`
- `formatarDataHora(date: Date | string): string`

## Database Commands (Rust Backend)

### New Tauri Commands

1. **verificar_configuracao**: Check if configuration exists
   ```typescript
   const existe = await invoke<boolean>("verificar_configuracao");
   ```

2. **obter_configuracao**: Get current configuration
   ```typescript
   const config = await invoke<Config>("obter_configuracao");
   ```

3. **testar_conexao**: Test database connection
   ```typescript
   const mensagem = await invoke<string>("testar_conexao", {
     servidorIp: "127.0.0.1",
     usuarioBanco: "root",
     senhaBanco: "password",
     porta: 3306,
     nomeBanco: "pdv"
   });
   ```

4. **salvar_configuracao**: Save configuration (with validation)
   ```typescript
   const mensagem = await invoke<string>("salvar_configuracao", {
     servidorIp: "127.0.0.1",
     usuarioBanco: "root",
     senhaBanco: "password",
     porta: 3306,
     nomeBanco: "pdv"
   });
   ```

5. **excluir_configuracao**: Delete configuration
   ```typescript
   const mensagem = await invoke<string>("excluir_configuracao");
   ```

## Navigation

Access the example forms at:
- `/app/cadastro/exemplo-formulario` - See all field types in action

Access database configuration at:
- `/app/configuracoes` → "Banco de Dados" tab

## Best Practices

1. **Always validate before saving**: The form validates automatically on submit
2. **Use appropriate field types**: CPF/CNPJ fields have built-in validation
3. **Provide helper text**: Use the `dica` property for complex fields
4. **Set reasonable grid widths**: Use `larguraGrid` to control layout (1-12)
5. **Test your validations**: Verify custom validators work as expected

## Future Enhancements

- File upload fields
- Rich text editor field
- Image preview field
- Multi-select field
- Autocomplete field with search
- Dynamic field dependencies (show/hide based on other fields)
