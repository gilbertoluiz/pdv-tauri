import { invoke } from "@tauri-apps/api/core";

export interface Cliente {
  id?: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Produto {
  id?: number;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  unidade?: string;
  preco_custo?: number;
  preco_venda: number;
  estoque?: number;
  estoque_minimo?: number;
  data_validade?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class DatabaseService {
  // Initialize database tables
  static async inicializarTabelas(): Promise<string> {
    return await invoke<string>("inicializar_tabelas");
  }

  // Generic query execution
  static async executarQuery(
    query: string,
    params: string[] = []
  ): Promise<any[]> {
    return await invoke<any[]>("executar_query", { query, params });
  }

  // Generic command execution (INSERT, UPDATE, DELETE)
  static async executarComando(
    comando: string,
    params: string[] = []
  ): Promise<number> {
    return await invoke<number>("executar_comando", { comando, params });
  }

  // Cliente CRUD operations
  static async listarClientes(): Promise<Cliente[]> {
    const query = "SELECT * FROM clientes ORDER BY nome";
    return await this.executarQuery(query);
  }

  static async buscarCliente(id: number): Promise<Cliente | null> {
    const query = "SELECT * FROM clientes WHERE id = ?";
    const result = await this.executarQuery(query, [String(id)]);
    return result.length > 0 ? result[0] : null;
  }

  static async criarCliente(cliente: Cliente): Promise<number> {
    const comando = `
      INSERT INTO clientes (nome, email, telefone, cpf, cnpj, endereco, cidade, estado, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      cliente.nome,
      cliente.email || "",
      cliente.telefone || "",
      cliente.cpf || "",
      cliente.cnpj || "",
      cliente.endereco || "",
      cliente.cidade || "",
      cliente.estado || "",
      String(cliente.ativo !== false),
    ];
    return await this.executarComando(comando, params);
  }

  static async atualizarCliente(id: number, cliente: Cliente): Promise<number> {
    const comando = `
      UPDATE clientes 
      SET nome = ?, email = ?, telefone = ?, cpf = ?, cnpj = ?, 
          endereco = ?, cidade = ?, estado = ?, ativo = ?
      WHERE id = ?
    `;
    const params = [
      cliente.nome,
      cliente.email || "",
      cliente.telefone || "",
      cliente.cpf || "",
      cliente.cnpj || "",
      cliente.endereco || "",
      cliente.cidade || "",
      cliente.estado || "",
      String(cliente.ativo !== false),
      String(id),
    ];
    return await this.executarComando(comando, params);
  }

  static async excluirCliente(id: number): Promise<number> {
    const comando = "DELETE FROM clientes WHERE id = ?";
    return await this.executarComando(comando, [String(id)]);
  }

  // Produto CRUD operations
  static async listarProdutos(): Promise<Produto[]> {
    const query = "SELECT * FROM produtos ORDER BY nome";
    return await this.executarQuery(query);
  }

  static async buscarProduto(id: number): Promise<Produto | null> {
    const query = "SELECT * FROM produtos WHERE id = ?";
    const result = await this.executarQuery(query, [String(id)]);
    return result.length > 0 ? result[0] : null;
  }

  static async criarProduto(produto: Produto): Promise<number> {
    const comando = `
      INSERT INTO produtos (codigo, nome, descricao, categoria, unidade, preco_custo, 
                           preco_venda, estoque, estoque_minimo, data_validade, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      produto.codigo,
      produto.nome,
      produto.descricao || "",
      produto.categoria || "",
      produto.unidade || "",
      String(produto.preco_custo || 0),
      String(produto.preco_venda),
      String(produto.estoque || 0),
      String(produto.estoque_minimo || 0),
      produto.data_validade || "",
      String(produto.ativo !== false),
    ];
    return await this.executarComando(comando, params);
  }

  static async atualizarProduto(id: number, produto: Produto): Promise<number> {
    const comando = `
      UPDATE produtos 
      SET codigo = ?, nome = ?, descricao = ?, categoria = ?, unidade = ?,
          preco_custo = ?, preco_venda = ?, estoque = ?, estoque_minimo = ?,
          data_validade = ?, ativo = ?
      WHERE id = ?
    `;
    const params = [
      produto.codigo,
      produto.nome,
      produto.descricao || "",
      produto.categoria || "",
      produto.unidade || "",
      String(produto.preco_custo || 0),
      String(produto.preco_venda),
      String(produto.estoque || 0),
      String(produto.estoque_minimo || 0),
      produto.data_validade || "",
      String(produto.ativo !== false),
      String(id),
    ];
    return await this.executarComando(comando, params);
  }

  static async excluirProduto(id: number): Promise<number> {
    const comando = "DELETE FROM produtos WHERE id = ?";
    return await this.executarComando(comando, [String(id)]);
  }
}
