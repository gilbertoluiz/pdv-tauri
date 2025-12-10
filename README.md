# PDV Suite (Tauri v2 + React + Rust)

Uma aplicação PDV moderna construída com Tauri v2, React, TypeScript e Rust.

## Características

- ✅ Tauri v2 com configuração válida
- ✅ Backend Rust com comando `salvar_configuracao`
- ✅ Frontend React + Vite com React Router
- ✅ Material-UI (MUI) para interface
- ✅ Tema claro/escuro
- ✅ Três telas principais:
  - Configuração Inicial (IP, usuário, senha do banco)
  - Login
  - Pedidos (CRUD básico)
- ✅ TypeScript com configuração moderna
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
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── TelaConfiguracaoInicial.tsx
│   │   │   ├── TelaLogin.tsx
│   │   │   └── TelaPedidos.tsx
│   │   ├── App.tsx         # Componente raiz com rotas
│   │   ├── main.tsx        # Entry point
│   │   └── tema.ts         # Tema Material-UI
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.mjs
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
- `vite` ^5.4.21
- `typescript` ^5.6.0

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