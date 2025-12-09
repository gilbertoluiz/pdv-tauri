# PDV Suite (Tauri + React + Rust)

- Nomes de classes e parâmetros em português
- Tema claro/escuro
- Tela de configuração inicial
- Login após configuração
- Home do PDV e CRUD
- Emissão TXT (Unimake) e watcher de retornos (a implementar com `notify`)

Build:
- Instale Rust e Node 20
- `cd ui && npm ci && npm run build`
- `cd .. && npm install && npm run tauri`