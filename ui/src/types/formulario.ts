// Field type definitions for dynamic forms

export type TipoCampo =
  | "text"
  | "number"
  | "email"
  | "password"
  | "phone"
  | "cpf"
  | "cnpj"
  | "cep"
  | "money"
  | "date"
  | "datetime"
  | "select"
  | "checkbox"
  | "textarea"
  | "url";

export interface OpcaoSelect {
  value: string | number;
  label: string;
}

export interface RegraValidacao {
  tipo: "obrigatorio" | "email" | "cpf" | "cnpj" | "phone" | "url" | "minLength" | "maxLength" | "min" | "max" | "custom";
  mensagem: string;
  valor?: number; // For minLength, maxLength, min, max
  validador?: (value: any) => boolean; // For custom validation
}

export interface DefinicaoCampo {
  nome: string; // Field name (used as key in form data)
  label: string; // Display label
  tipo: TipoCampo; // Field type
  obrigatorio?: boolean; // Whether field is required
  placeholder?: string; // Placeholder text
  valorPadrao?: any; // Default value
  opcoes?: OpcaoSelect[]; // Options for select fields
  validacoes?: RegraValidacao[]; // Validation rules
  desabilitado?: boolean; // Whether field is disabled
  dica?: string; // Helper text
  linhas?: number; // Number of rows for textarea
  min?: number; // Minimum value for number/date fields
  max?: number; // Maximum value for number/date fields
  mascara?: string; // Custom mask pattern
  larguraGrid?: number; // Grid width (1-12 for Material-UI grid)
}

export interface DadosFormulario {
  [key: string]: any;
}

export interface ErrosFormulario {
  [key: string]: string;
}

export type ModoFormulario = "criar" | "editar" | "visualizar";
