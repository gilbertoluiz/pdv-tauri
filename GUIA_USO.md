# Guia de Uso - PDV Suite

## Correções Implementadas

Este documento descreve as correções feitas para resolver os problemas relatados.

### 1. ✅ Telas de Teste Adicionadas ao Menu

**Problema:** As telas de teste não apareciam nos menus.

**Solução:** Adicionadas as seguintes telas ao menu lateral em "Cadastros":
- **Formulário Dinâmico (Teste)** - Demonstração do sistema de formulários dinâmicos
- **Gerenciamento de Arquivos** - Sistema de gerenciamento de arquivos TXT/XML

Para acessar: Navegue para **Cadastros** → Expanda o submenu → Selecione a tela desejada

### 2. ✅ Configuração Persistente

**Problema:** Após configurar o sistema, as configurações não eram carregadas ao rodar novamente.

**Solução:** 
- A tela de configuração inicial agora carrega automaticamente as configurações salvas
- Ao acessar `/` (tela de configuração), os campos são preenchidos com os valores salvos
- Funciona tanto em desenvolvimento quanto em produção

**Como funciona:**
1. As configurações são salvas em: `AppData/Roaming/com.pdvsuite.app/config.json` (Windows)
2. Ao iniciar o app, o sistema verifica se a configuração existe
3. Se existir, redireciona para `/login`, caso contrário para `/` (configuração)

### 3. ✅ Campos de Formulário Funcionando

**Problema:** Ao digitar nos campos dos formulários, as letras apareciam e sumiam imediatamente.

**Solução:** 
- Corrigido o problema de estado no componente `FormularioDinamico`
- O useEffect que inicializava os dados estava sendo executado a cada render
- Agora usa `useMemo` para calcular dados iniciais e `useEffect` apenas para reset quando necessário

**Como testar:**
1. Acesse qualquer tela de cadastro (Clientes ou Produtos)
2. Clique em "Novo"
3. Digite nos campos - o texto deve permanecer visível

### 4. ✅ CRUD Completo com Banco de Dados

**Problema:** CRUDs não estavam completos, sem conexão com banco de dados.

**Solução Implementada:**

#### Backend (Rust)
Adicionados três novos comandos Tauri:

1. **`inicializar_tabelas`** - Cria as tabelas se não existirem:
   - `clientes` - Tabela de clientes
   - `produtos` - Tabela de produtos

2. **`executar_query`** - Executa queries SELECT
   - Parâmetros: query SQL, array de parâmetros
   - Retorna: array de objetos JSON

3. **`executar_comando`** - Executa INSERT/UPDATE/DELETE
   - Parâmetros: comando SQL, array de parâmetros
   - Retorna: número de linhas afetadas

#### Frontend (TypeScript)

**DatabaseService** (`ui/src/services/database.ts`):
- Classe utilitária com métodos para todas operações CRUD
- Clientes: `listarClientes()`, `buscarCliente()`, `criarCliente()`, `atualizarCliente()`, `excluirCliente()`
- Produtos: `listarProdutos()`, `buscarProduto()`, `criarProduto()`, `atualizarProduto()`, `excluirProduto()`

**Tela de Clientes** (`ui/src/pages/cadastro/TelaClientes.tsx`):
- ✅ Listagem completa com tabela
- ✅ Criar novo cliente
- ✅ Editar cliente existente
- ✅ Excluir cliente (com confirmação)
- ✅ Campos: Nome, Email, Telefone, CPF, CNPJ, Endereço, Cidade, Estado, Status

**Tela de Produtos** (`ui/src/pages/cadastro/TelaProdutos.tsx`):
- ✅ Listagem completa com tabela
- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Excluir produto (com confirmação)
- ✅ Campos: Código, Nome, Descrição, Categoria, Unidade, Preço Custo, Preço Venda, Estoque, Estoque Mínimo, Data Validade, Status

### 5. ✅ Navegação Livre entre Telas

**Problema:** Ao acessar tela de cadastro, não conseguia mudar para outras telas.

**Solução:**
- Verificada implementação do LayoutPrincipal - está correta
- Menu lateral sempre acessível (pode ser expandido/recolhido)
- Dialogs de criação/edição não bloqueiam navegação
- Possível fechar dialogs com ESC ou clicando fora

### 6. ✅ Erro TypeScript JSX Namespace

**Problema Adicional:** Erro "Não é possível encontrar o namespace 'JSX'.ts(2503)" em várias telas.

**Solução:**
- Instalado `@types/react` como dependência de desenvolvimento
- Atualizado `tsconfig.json` com tipos corretos e biblioteca DOM
- Adicionadas configurações: `"lib": ["ES2020", "DOM", "DOM.Iterable"]` e `"types": ["vite/client", "react", "react-dom"]`

## Como Usar o Sistema

### Primeira Execução

1. **Configurar Banco de Dados:**
   - Na primeira execução, a tela de configuração aparece automaticamente
   - Preencha os dados de conexão MySQL:
     - IP do Servidor (ex: 127.0.0.1)
     - Porta (padrão: 3306)
     - Nome do Banco (ex: pdv)
     - Usuário (ex: root)
     - Senha
   - Clique em "Testar Conexão" para validar
   - Clique em "Salvar e Continuar"

2. **Login:**
   - Após salvar a configuração, você é redirecionado para o login
   - Credenciais de teste:
     - Email: `admin@pdv.com`
     - Senha: `admin`

3. **Inicializar Tabelas:**
   - As tabelas são criadas automaticamente na primeira tentativa de acesso
   - Você também pode inicializar manualmente via DatabaseService

### Usando o CRUD de Clientes

1. No menu lateral, navegue para **Cadastros** → **Clientes**
2. Clique em "Novo Cliente" para criar
3. Preencha os campos (campos com * são obrigatórios)
4. Clique em "Criar" para salvar
5. Use os ícones de Editar ✏️ ou Excluir 🗑️ para gerenciar clientes

### Usando o CRUD de Produtos

1. No menu lateral, navegue para **Cadastros** → **Produtos**
2. Clique em "Novo Produto" para criar
3. Preencha os campos (campos com * são obrigatórios)
4. Clique em "Criar" para salvar
5. Use os ícones de Editar ✏️ ou Excluir 🗑️ para gerenciar produtos

### Adaptando para Sua Base de Dados

#### 1. Criar Novas Tabelas

Edite `src-tauri/src/main.rs` no comando `inicializar_tabelas`:

```rust
// Adicione sua nova tabela
conn.query_drop(
  r"CREATE TABLE IF NOT EXISTS sua_tabela (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campo1 VARCHAR(255),
    campo2 DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )"
).map_err(|e| format!("Erro ao criar tabela: {}", e))?;
```

#### 2. Criar Interface TypeScript

Em `ui/src/services/database.ts`:

```typescript
export interface SuaEntidade {
  id?: number;
  campo1: string;
  campo2: number;
  created_at?: string;
}
```

#### 3. Adicionar Métodos CRUD

Em `ui/src/services/database.ts`:

```typescript
static async listarSuaEntidade(): Promise<SuaEntidade[]> {
  const query = "SELECT * FROM sua_tabela ORDER BY campo1";
  return await this.executarQuery(query);
}

static async criarSuaEntidade(entidade: SuaEntidade): Promise<number> {
  const comando = "INSERT INTO sua_tabela (campo1, campo2) VALUES (?, ?)";
  const params = [entidade.campo1, String(entidade.campo2)];
  return await this.executarComando(comando, params);
}

// Adicione métodos para buscar, atualizar e excluir...
```

#### 4. Criar Tela de CRUD

Use `TelaClientes.tsx` ou `TelaProdutos.tsx` como modelo:

```typescript
import { DatabaseService, SuaEntidade } from "../../services/database";

export default function TelaSuaEntidade() {
  const [entidades, setEntidades] = useState<SuaEntidade[]>([]);
  
  const carregarEntidades = async () => {
    const dados = await DatabaseService.listarSuaEntidade();
    setEntidades(dados);
  };
  
  // Implemente handleSalvar, handleExcluir, etc.
  // ...
}
```

## Comandos de Desenvolvimento

```bash
# Frontend
cd ui
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificar código
npm run format       # Formatar código

# Backend (em outro terminal)
cd src-tauri
cargo tauri dev      # Executar aplicação
cargo tauri build    # Build de produção
```

## Estrutura de Arquivos Importantes

```
pdv-tauri/
├── src-tauri/
│   └── src/
│       └── main.rs              # Comandos Rust (CRUD, config, etc)
├── ui/
│   └── src/
│       ├── services/
│       │   └── database.ts       # Serviço de banco de dados
│       ├── pages/
│       │   └── cadastro/
│       │       ├── TelaClientes.tsx   # CRUD de Clientes
│       │       ├── TelaProdutos.tsx   # CRUD de Produtos
│       │       ├── TelaExemploFormularioDinamico.tsx
│       │       └── TelaGerenciamentoArquivos.tsx
│       ├── components/
│       │   ├── FormularioDinamico.tsx # Sistema de formulários
│       │   └── MenuLateral.tsx         # Menu de navegação
│       └── App.tsx                     # Rotas principais
```

## Dicas

1. **Backup:** Sempre faça backup do banco antes de testes
2. **Validações:** Os campos possuem validação automática (CPF, CNPJ, Email, etc)
3. **Formatação:** Campos de telefone, CPF, CNPJ e moeda são formatados automaticamente
4. **Estados brasileiros:** Lista completa de UF disponível nos selects
5. **Permissões:** O sistema possui controle de permissões por módulo/submódulo
6. **Temas:** 5 esquemas de cores disponíveis + modo claro/escuro

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs no console do navegador (F12)
2. Verifique os logs do Rust no terminal
3. Consulte a documentação do Tauri: https://tauri.app/
4. Consulte a documentação do Material-UI: https://mui.com/
