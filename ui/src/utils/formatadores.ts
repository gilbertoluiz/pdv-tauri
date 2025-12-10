// Formatting functions for Brazilian documents and other fields

/**
 * Formats CPF: XXX.XXX.XXX-XX
 */
export function formatarCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return cpf;
}

/**
 * Formats CNPJ: XX.XXX.XXX/XXXX-XX
 */
export function formatarCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length <= 14) {
    return cleaned
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  return cnpj;
}

/**
 * Formats Brazilian phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export function formatarTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, "");

  // With country code (13 digits): +55 (XX) XXXXX-XXXX
  if (cleaned.length === 13 && cleaned.startsWith("55")) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
  }

  // With country code (12 digits): +55 (XX) XXXX-XXXX
  if (cleaned.length === 12 && cleaned.startsWith("55")) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, "+$1 ($2) $3-$4");
  }

  // Mobile (11 digits): (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Landline (10 digits): (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
}

/**
 * Formats CEP: XXXXX-XXX
 */
export function formatarCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length <= 8) {
    return cleaned.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
  }
  return cep;
}

/**
 * Formats currency (Brazilian Real)
 */
export function formatarMoeda(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) / 100 : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

/**
 * Parses currency string to number
 */
export function parseMoeda(value: string): number {
  const cleaned = value.replace(/\D/g, "");
  return parseFloat(cleaned) / 100;
}

/**
 * Formats date to Brazilian format: DD/MM/YYYY
 */
export function formatarData(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

/**
 * Formats date and time to Brazilian format: DD/MM/YYYY HH:MM
 */
export function formatarDataHora(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("pt-BR");
}

/**
 * Removes all non-numeric characters
 */
export function apenasNumeros(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Capitalizes first letter of each word
 */
export function capitalizarPalavras(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Formats percentage
 */
export function formatarPorcentagem(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
