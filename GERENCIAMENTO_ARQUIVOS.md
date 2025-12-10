# Sistema de Gerenciamento de Arquivos - Documentação

## Novas Funcionalidades Implementadas

### 1. Configuração do Caminho Unimake

O sistema agora permite configurar o caminho de instalação do Unimake nas configurações.

#### Backend (Rust)

**Campo adicionado ao Config:**
```rust
caminho_unimake: Option<String>
```

**Validação:**
- Campo opcional (pode ser vazio)
- Se preenchido, o sistema valida se o caminho existe
- Retorna erro se o caminho for informado mas não existir

#### Frontend

**Onde configurar:**
1. **Tela de Configuração Inicial** (`/`)
   - Campo "Caminho do Unimake (Opcional)"
   - Placeholder: `C:\Unimake`

2. **Tela de Configurações** (`/app/configuracoes` → aba "Banco de Dados")
   - Mesmo campo disponível para edição

### 2. Sistema de Geração de Arquivos TXT

#### Comando Tauri: `gerar_txt`

**Parâmetros:**
```typescript
await invoke("gerar_txt", {
  caminho: "C:\\temp\\arquivo.txt",
  conteudo: "Conteúdo do arquivo..."
});
```

**Funcionalidades:**
- Cria o arquivo no caminho especificado
- Cria diretórios automaticamente se não existirem
- Retorna mensagem de sucesso com o caminho do arquivo
- Lança erro se não conseguir criar o arquivo

**Exemplo de uso:**
```typescript
const mensagem = await invoke<string>("gerar_txt", {
  caminho: "C:\\temp\\hello.txt",
  conteudo: "Hello World!\nArquivo gerado em: " + new Date().toLocaleString()
});
console.log(mensagem); // "Arquivo gerado com sucesso em: C:\temp\hello.txt"
```

### 3. Sistema de Leitura de Arquivos

#### Comando Tauri: `ler_arquivo`

**Parâmetros:**
```typescript
const conteudo = await invoke<string>("ler_arquivo", {
  caminho: "C:\\retornos\\arquivo.xml"
});
```

**Funcionalidades:**
- Lê arquivos TXT, XML ou qualquer arquivo de texto
- Retorna o conteúdo completo do arquivo como string
- Lança erro se o arquivo não existir
- Lança erro se não conseguir ler o arquivo

**Suporta:**
- Arquivos TXT
- Arquivos XML
- Qualquer arquivo de texto puro

### 4. Sistema de Listagem de Arquivos em Diretório

#### Comando Tauri: `listar_arquivos_diretorio`

**Parâmetros:**
```typescript
const arquivos = await invoke<string[]>("listar_arquivos_diretorio", {
  caminho: "C:\\retornos",
  extensao: "xml" // Opcional
});
```

**Funcionalidades:**
- Lista todos os arquivos em um diretório
- Filtra por extensão (opcional)
- Retorna array com caminhos completos dos arquivos
- Apenas lista arquivos (não lista subdiretórios)
- Lança erro se o diretório não existir

**Exemplos:**
```typescript
// Listar todos os arquivos
const todos = await invoke<string[]>("listar_arquivos_diretorio", {
  caminho: "C:\\retornos",
  extensao: null
});

// Listar apenas XMLs
const xmls = await invoke<string[]>("listar_arquivos_diretorio", {
  caminho: "C:\\retornos",
  extensao: "xml"
});

// Listar apenas TXTs
const txts = await invoke<string[]>("listar_arquivos_diretorio", {
  caminho: "C:\\retornos",
  extensao: "txt"
});
```

### 5. Verificação de Existência de Caminho

#### Comando Tauri: `verificar_caminho_existe`

**Parâmetros:**
```typescript
const existe = await invoke<boolean>("verificar_caminho_existe", {
  caminho: "C:\\Unimake"
});
```

**Funcionalidades:**
- Verifica se um arquivo ou diretório existe
- Retorna `true` se existir
- Retorna `false` se não existir

## Interface de Gerenciamento de Arquivos

### Tela: TelaGerenciamentoArquivos

**Rota:** `/app/cadastro/gerenciamento-arquivos`

#### Seção 1: Gerar Arquivo TXT

**Campos:**
- **Caminho Completo do Arquivo**: onde criar o arquivo
- **Conteúdo do Arquivo**: texto a ser escrito (multi-linha)

**Botões:**
- **Gerar Arquivo**: cria o arquivo com o conteúdo especificado
- **Exemplo: Hello World**: preenche automaticamente um exemplo

**Recursos:**
- Cria diretórios automaticamente
- Gera timestamp único no nome do arquivo no exemplo
- Mostra mensagem de sucesso ou erro
- Desabilita botões durante o processamento

#### Seção 2: Ler Arquivo (TXT/XML)

**Campos:**
- **Caminho Completo do Arquivo**: arquivo a ser lido

**Funcionalidades:**
- Botão "Ler Arquivo" para carregar o conteúdo
- Exibe o conteúdo em caixa de texto com fonte monoespaçada
- Preserva formatação original (quebras de linha, espaços)
- Suporta scroll para arquivos grandes (max height: 300px)
- Mostra erros se arquivo não existir

#### Seção 3: Listar Arquivos de Retorno

**Campos:**
- **Diretório**: caminho do diretório a listar
- **Extensão (Opcional)**: filtro por extensão (xml, txt, etc.)

**Funcionalidades:**
- Lista todos os arquivos do diretório
- Filtra por extensão se especificado
- Mostra contador de arquivos encontrados
- Lista scrollável (max height: 400px)
- Cada arquivo tem botão para leitura rápida
- Clicando no ícone, lê o arquivo automaticamente
- Mostra caminho completo como texto secundário

**Exemplos de Uso:**
1. Listar XMLs de retorno do Unimake
2. Listar TXTs de retorno de outros sistemas
3. Processar arquivos em lote

#### Guia de Uso Integrado

A tela inclui um painel informativo com:
- Como gerar arquivos
- Como ler arquivos
- Como usar a listagem de arquivos de retorno
- Dicas e melhores práticas

## Casos de Uso

### 1. Gerar Arquivo de Envio para Unimake

```typescript
const conteudoNFe = gerarXMLNFe(); // Sua função que gera o XML

await invoke("gerar_txt", {
  caminho: "C:\\Unimake\\Envio\\nfe_123.xml",
  conteudo: conteudoNFe
});
```

### 2. Processar Arquivos de Retorno

```typescript
// 1. Listar arquivos XML de retorno
const arquivos = await invoke<string[]>("listar_arquivos_diretorio", {
  caminho: "C:\\Unimake\\Retorno",
  extensao: "xml"
});

// 2. Processar cada arquivo
for (const arquivo of arquivos) {
  const conteudo = await invoke<string>("ler_arquivo", {
    caminho: arquivo
  });
  
  // Processar o conteúdo XML
  processarRetornoNFe(conteudo);
}
```

### 3. Validar Configuração do Unimake

```typescript
const caminhoUnimake = "C:\\Unimake";

const existe = await invoke<boolean>("verificar_caminho_existe", {
  caminho: caminhoUnimake
});

if (!existe) {
  alert("Caminho do Unimake não encontrado!");
}
```

### 4. Gerar Log de Operações

```typescript
const timestamp = new Date().toISOString();
const caminhoLog = `C:\\PDV\\Logs\\operacao_${timestamp}.txt`;

const conteudoLog = `
Operação realizada em: ${timestamp}
Usuário: ${usuario.nome}
Ação: Emissão de NF-e
Status: Sucesso
`;

await invoke("gerar_txt", {
  caminho: caminhoLog,
  conteudo: conteudoLog
});
```

## Tratamento de Erros

### Erros Comuns e Soluções

**"Caminho do Unimake não existe"**
- Verifique se o caminho está correto
- Certifique-se de que o Unimake está instalado
- Use barras invertidas duplas no Windows: `C:\\Unimake`

**"Arquivo não encontrado"**
- Verifique se o caminho está completo e correto
- Certifique-se de que o arquivo existe
- Verifique permissões de leitura

**"Erro ao escrever arquivo"**
- Verifique permissões de escrita no diretório
- Certifique-se de que há espaço em disco
- Verifique se o caminho é válido

**"Diretório não encontrado"**
- Certifique-se de que o diretório existe
- Para gerar arquivos, os diretórios são criados automaticamente
- Para listar/ler, o diretório deve existir previamente

## Integração com Fluxo de Trabalho

### Fluxo Típico de Emissão de NF-e

1. **Configurar Unimake** (uma vez)
   - Ir em Configurações → Banco de Dados
   - Preencher "Caminho do Unimake"
   - Sistema valida se existe

2. **Gerar XML de Envio**
   - Sistema cria XML da NF-e
   - Usa `gerar_txt` para salvar em `C:\Unimake\Envio\`

3. **Aguardar Processamento**
   - Unimake processa o arquivo
   - Gera arquivo de retorno em `C:\Unimake\Retorno\`

4. **Ler Retorno**
   - Usar `listar_arquivos_diretorio` para encontrar XMLs de retorno
   - Usar `ler_arquivo` para cada retorno
   - Processar resposta (aprovada, rejeitada, etc.)

5. **Armazenar/Limpar**
   - Mover arquivos processados para pasta de histórico
   - Ou deletar arquivos já processados

## Próximos Passos Sugeridos

1. **Sistema de Watch de Diretório**
   - Monitorar pasta de retorno automaticamente
   - Notificar quando novos arquivos chegarem

2. **Histórico de Arquivos**
   - Manter log de arquivos gerados e processados
   - Interface para consultar histórico

3. **Validação de XML**
   - Validar estrutura XML antes de enviar
   - Verificar schema XSD

4. **Processamento em Lote**
   - Gerar múltiplos arquivos de uma vez
   - Processar múltiplos retornos automaticamente

5. **Backup Automático**
   - Copiar arquivos importantes automaticamente
   - Sistema de versionamento
