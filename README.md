# PDV Suite (Tauri v2 + React + Rust)

Uma aplicação PDV moderna construída com Tauri v2, React, TypeScript e Rust.

> 📖 **[Ver Guia de Uso Completo](GUIA_USO.md)** - Instruções detalhadas de uso e como adaptar para sua base de dados

## ✨ Correções Recentes

- ✅ **Telas de teste adicionadas ao menu** - Formulário Dinâmico e Gerenciamento de Arquivos agora acessíveis
- ✅ **Configuração persiste após reload** - Configurações do banco são carregadas automaticamente
- ✅ **Campos de formulário funcionando** - Corrigido problema onde texto digitado desaparecia
- ✅ **CRUD completo implementado** - Clientes e Produtos com conexão MySQL real
- ✅ **Navegação livre** - Possível trocar de tela a qualquer momento
- ✅ **Erro TypeScript JSX corrigido** - Namespace JSX resolvido com instalação de @types/react

## Características

- ✅ Tauri v2 com configuração válida
- ✅ **CRUD Completo com MySQL**:
  - Sistema de clientes (nome, email, telefone, CPF/CNPJ, endereço, etc)
  - Sistema de produtos (código, nome, preços, estoque, categoria, etc)
  - Comandos Rust genéricos para query/comando SQL
  - Serviço de banco de dados TypeScript reutilizável
- ✅ Backend Rust com comandos `salvar_configuracao`, `executar_query`, `executar_comando`
- ✅ **Configuração persistente** - Carrega automaticamente configurações salvas
- ✅ Frontend React + Vite com React Router
- ✅ Material-UI (MUI) para interface
- ✅ **Sistema de formulários dinâmicos**:
  - Validação automática (CPF, CNPJ, Email, Telefone, etc)
  - Formatação automática de campos
  - Telas de exemplo funcionais no menu
- ✅ **Tailwind CSS** integrado para classes utilitárias
- ✅ **Prettier** configurado para formatação automática
- ✅ **ESLint** configurado para qualidade de código
- ✅ Tema claro/escuro com **5 esquemas de cores personalizáveis**
- ✅ **Sistema de autenticação completo**:
  - Login com validação
  - Recuperação de senha por email
  - Alteração de senha com validações
  - Gerenciamento de permissões por módulo
- ✅ **Layouts responsivos**:
  - Layout simples para autenticação e configuração
  - Layout principal com sidebar retrátil
  - Menu lateral com controle de permissões
- ✅ **Estrutura organizada de páginas**:
  - `pages/config/` - Configuração inicial do banco
  - `pages/auth/` - Login, recuperação e alteração de senha
  - `pages/app/` - Dashboard e pedidos
  - `pages/cadastro/` - Clientes, produtos, formulários de teste, arquivos
  - `pages/configuracoes/` - Configurações do sistema
- ✅ **Menu hierárquico com 7 módulos**:
  - Dashboard, Cadastros, Pedidos, Financeiro, Relatórios, Configurações
  - Submenus expansíveis com telas de teste acessíveis
  - Visibilidade baseada em permissões
- ✅ TypeScript com configuração moderna e tipos React corrigidos
- ✅ Bundle MSI para Windows
- 🔄 Preparado para updates automáticos (futuro)
- 🔄 Preparado para licenciamento/ativação (futuro)

## Pré-requisitos

### Windows

1. **Rust (MSVC toolchain)**
   - Instale via [rustup](https://rustup.rs/)
   - Durante a instalação, selecione a toolchain MSVC (não GNU)
   
2. **Visual Studio Build Tools**
   - Baixe [Build Tools for Visual Studio](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
   - Instale com: "Desktop development with C++"
   
3. **Node.js 20+**
   - Baixe do [site oficial](https://nodejs.org/)
   
4. **Tauri CLI** (opcional, mas recomendado)
   ```bash
   cargo install tauri-cli
   ```

## Desenvolvimento

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/gilbertoluiz/pdv-tauri.git
   cd pdv-tauri
   ```

2. Instale dependências do frontend:
   ```bash
   cd ui
   npm install
   ```

### Executando em modo de desenvolvimento

Você precisa de dois terminais:

**Terminal 1 - Frontend (Vite Dev Server):**
```bash
cd ui
npm run dev
```

**Terminal 2 - Aplicação Tauri:**
```bash
cd src-tauri
cargo tauri dev
```

Ou, se instalou o Tauri CLI globalmente:
```bash
cargo tauri dev
```

A aplicação abrirá automaticamente com hot-reload habilitado.

### Comandos de Desenvolvimento

```bash
# Formatar código com Prettier
npm run format

# Verificar formatação
npm run format:check

# Executar linter (ESLint)
npm run lint

# Corrigir problemas do linter automaticamente
npm run lint:fix
```

## Build de Produção

### Build do Frontend

```bash
cd ui
npm run build
```

Isso gera os arquivos otimizados em `ui/dist/`.

### Build da Aplicação Tauri

```bash
cd src-tauri
cargo tauri build
```

O instalador MSI será gerado em:
```
src-tauri/target/release/bundle/msi/Pdv Suite_0.1.0_x64_en-US.msi
```

## Estrutura do Projeto

```
pdv-tauri/
├── src-tauri/              # Backend Rust
│   ├── src/
│   │   └── main.rs         # Comando salvar_configuracao
│   ├── icons/
│   │   └── icon.ico        # Ícone da aplicação
│   ├── Cargo.toml          # Dependências Rust
│   ├── tauri.conf.json     # Configuração Tauri v2
│   └── build.rs            # Build script
├── ui/                     # Frontend React
│   ├── src/
│   │   ├── pages/          # Páginas organizadas por contexto
│   │   │   ├── config/     # Configuração inicial
│   │   │   │   ├── TelaConfiguracaoInicial.tsx
│   │   │   │   └── index.ts
│   │   │   ├── auth/       # Autenticação
│   │   │   │   ├── TelaLogin.tsx
│   │   │   │   └── index.ts
│   │   │   └── app/        # Funcionalidades principais
│   │   │       ├── TelaPedidos.tsx
│   │   │       └── index.ts
│   │   ├── App.tsx         # Componente raiz com rotas e seletor de tema
│   │   ├── main.tsx        # Entry point
│   │   ├── tema.ts         # Sistema de temas com 5 esquemas de cores
│   │   └── index.css       # Estilos globais e Tailwind
│   ├── public/             # Arquivos estáticos
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.mjs
│   ├── tailwind.config.js  # Configuração Tailwind CSS
│   ├── postcss.config.js   # Configuração PostCSS
│   ├── eslint.config.js    # Configuração ESLint
│   └── .prettierrc         # Configuração Prettier
├── .gitignore
└── README.md
```

## Configuração

### Tauri v2

O arquivo `src-tauri/tauri.conf.json` contém:
- `identifier`: `com.pdvsuite.app` (fixo para permitir upgrades in-place)
- `frontendDist`: `../ui/dist`
- `devUrl`: `http://localhost:5173`
- Bundle: MSI para Windows
- Ícone: `icons/icon.ico`

### Comandos Rust → JavaScript

⚠️ **Importante**: Em Tauri v2, parâmetros de comandos Rust em `snake_case` são automaticamente convertidos para `camelCase` no JavaScript.

**Rust:**
```rust
#[tauri::command]
async fn salvar_configuracao(
    servidor_ip: String,
    usuario_banco: String,
    senha_banco: String,
) -> Result<String, String>
```

**JavaScript/TypeScript:**
```typescript
import { invoke } from "@tauri-apps/api/core";

await invoke("salvar_configuracao", {
  servidorIp: ip,        // não servidor_ip
  usuarioBanco: usuario, // não usuario_banco
  senhaBanco: senha,     // não senha_banco
});
```

## Dependências Principais

### Backend (Rust)
- `tauri` v2 - Framework principal
- `tauri-plugin-shell` v2 - Plugin de shell
- `serde` & `serde_json` - Serialização

### Frontend (React)
- `@tauri-apps/api` v2 - API Tauri
- `react` & `react-dom` ^18.2.0
- `react-router-dom` ^7.10.1
- `@mui/material` ^7.3.6
- `tailwindcss` + `@tailwindcss/postcss` - CSS utilitário
- `vite` ^5.4.21
- `typescript` ^5.6.0
- `eslint` + `prettier` - Qualidade e formatação de código

## Sistema de Temas Personalizáveis

O aplicativo inclui um sistema de temas com **5 esquemas de cores** pré-definidos que o cliente pode selecionar:

### Esquemas Disponíveis

1. **Padrão** - Teal (#00897b) + Orange (#ff9800)
2. **Azul** - Blue (#1976d2) + Pink (#f50057)
3. **Verde** - Green (#388e3c) + Orange (#ffa726)
4. **Roxo** - Purple (#7b1fa2) + Cyan (#26c6da)
5. **Vermelho** - Red (#d32f2f) + Yellow (#fbc02d)

### Como Usar

Os clientes podem alternar entre esquemas de cores através do seletor "Tema" na barra superior do aplicativo. O tema também suporta modo claro/escuro através do switch "Escuro".

### Personalização Adicional

Para adicionar novos esquemas de cores, edite o arquivo `ui/src/tema.ts`:

```typescript
const coresPreDefinidas: Record<string, CoresPersonalizadas> = {
  meuTema: {
    primaria: "#HEX_COR_PRIMARIA",
    secundaria: "#HEX_COR_SECUNDARIA",
  },
  // ... outros temas
};
```

## Sistema de Autenticação e Permissões

### Visão Geral

O aplicativo inclui um sistema completo de autenticação com gerenciamento de permissões baseado em módulos e submódulos.

### Credenciais de Teste

- **Email**: `admin@pdv.com`
- **Senha**: `admin`

### Funcionalidades de Autenticação

1. **Login** (`/login`)
   - Validação de credenciais
   - Redirecionamento automático para dashboard
   - Mensagens de erro descritivas

2. **Recuperação de Senha** (`/recuperar-senha`)
   - Solicitação por email
   - Confirmação visual
   - Mock pronto para integração com API

3. **Alteração de Senha** (`/app/configuracoes`)
   - Requer senha atual
   - Validação de força (mínimo 6 caracteres)
   - Confirmação de senha
   - Previne reutilização da senha atual

### Sistema de Permissões

As permissões são organizadas por módulo e submódulo:

```typescript
interface Permissao {
  modulo: string;        // Ex: "cadastro", "pedidos"
  submodulo?: string;    // Ex: "clientes", "produtos"
  ler: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
}
```

### Módulos Disponíveis

1. **Dashboard** - Visão geral e estatísticas
2. **Cadastros**
   - Clientes
   - Produtos
   - Fornecedores
   - Categorias
3. **Pedidos** - Gerenciamento de pedidos
4. **Financeiro**
   - Contas a Pagar
   - Contas a Receber
5. **Relatórios**
   - Vendas
   - Estoque
6. **Configurações** - Sistema, segurança, geral

### Layouts

#### LayoutSimples
- Usado para: login, recuperação de senha, configuração inicial
- Design centralizado e limpo
- Sem navegação ou menu

#### LayoutPrincipal
- Usado para: todas as páginas após login
- AppBar com:
  - Seletor de tema
  - Toggle dark/light mode
  - Menu do usuário (perfil, configurações, sair)
- Sidebar retrátil (280px) com menu hierárquico
- Controle de permissões automático

### Integração com Backend

O sistema está preparado para integração com API/Tauri:

```typescript
// ui/src/contexts/AuthContext.tsx
const login = async (email: string, senha: string) => {
  // Substituir por chamada real:
  // const response = await invoke("autenticar", { email, senha });
  // const usuario = response.usuario;
  // setUsuario(usuario);
};
```

## Próximos Passos (Roadmap)

### Atualizações Automáticas
- [ ] Adicionar `tauri-plugin-updater`
- [ ] Configurar manifest de atualização
- [ ] Criar workflow de publicação

### Licenciamento/Ativação
- [ ] Implementar comandos `ativar` e `validar`
- [ ] Sistema de HWID + token assinado
- [ ] Armazenamento seguro em AppConfig

### Funcionalidades de Rede
- [ ] Comando `emitir_txt` para comunicação
- [ ] Polling de retorno de arquivos
- [ ] Sistema de retries com backoff
- [ ] Watcher de arquivos com `notify`

### Deploy
- [ ] Assinatura de código do MSI (signtool)
- [ ] Bypass do Windows SmartScreen
- [ ] CI/CD automatizado

## Observações Técnicas

- O arquivo `config.json` é salvo em `AppData/Roaming/com.pdvsuite.app/config.json` no Windows
- O `identifier` no `tauri.conf.json` deve permanecer estável para permitir upgrades via MSI
- Builds são otimizados com `opt-level = "s"` para tamanho reduzido
- Frontend usa ESNext modules com React JSX moderno
- **Tailwind CSS** está configurado com `preflight: false` para coexistir com MUI
- **ESLint** usa a configuração flat (v9+) no arquivo `eslint.config.js`
- **Prettier** formata automaticamente TypeScript, JavaScript, CSS e JSON

## Ferramentas de Qualidade de Código

### Prettier (Formatação)

Configuração em `.prettierrc`:
- Ponto e vírgula: Sim
- Aspas simples: Não (usa aspas duplas)
- Largura de linha: 100 caracteres
- Indentação: 2 espaços

### ESLint (Linting)

Configuração em `eslint.config.js`:
- Regras recomendadas do ESLint e TypeScript
- Suporte a React Hooks
- Aviso para variáveis não usadas (ignora prefixo `_`)
- React JSX moderno (sem necessidade de importar React)

### Tailwind CSS

Configuração em `tailwind.config.js`:
- Cores customizadas alinhadas com os temas MUI
- `preflight: false` para não conflitar com MUI
- Suporta todos os arquivos `.tsx` e `.jsx` em `src/`

## Solução de Problemas

### Erro "failed to bundle project"
- Verifique se os Build Tools do Visual Studio estão instalados
- Confirme que a toolchain MSVC do Rust está ativa: `rustup default stable-msvc`

### Erro "WebView2 not found"
- No Windows 10/11, o WebView2 geralmente já vem instalado
- Se necessário, instale o [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Porta 5173 já em uso
- Altere a porta no `vite.config.mjs` e atualize `devUrl` no `tauri.conf.json`

## Licença

Este projeto é privado e proprietário.

## Autor

Desenvolvido por Seu Nome