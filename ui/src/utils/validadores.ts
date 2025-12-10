// Validation functions for Brazilian documents and other fields

/**
 * Validates CPF (Cadastro de Pessoas Físicas)
 */
export function validarCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, "");

  // Check length
  if (cleanCPF.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(9))) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

/**
 * Validates CNPJ (Cadastro Nacional da Pessoa Jurídica)
 */
export function validarCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  const cleanCNPJ = cnpj.replace(/\D/g, "");

  // Check length
  if (cleanCNPJ.length !== 14) return false;

  // Check if all digits are the same
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Validate first check digit
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Validate second check digit
  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Validates email format
 */
export function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Brazilian phone number (with or without country code)
 */
export function validarTelefone(telefone: string): boolean {
  // Remove non-numeric characters
  const cleanPhone = telefone.replace(/\D/g, "");

  // Valid formats:
  // 10 digits: (XX) XXXX-XXXX (landline)
  // 11 digits: (XX) 9XXXX-XXXX (mobile)
  // 12 digits: 55 XX XXXX-XXXX (with country code - landline)
  // 13 digits: 55 XX 9XXXX-XXXX (with country code - mobile)
  return cleanPhone.length >= 10 && cleanPhone.length <= 13;
}

/**
 * Validates that a value is not empty
 */
export function validarObrigatorio(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates minimum length
 */
export function validarTamanhoMinimo(value: string, min: number): boolean {
  return value.length >= min;
}

/**
 * Validates maximum length
 */
export function validarTamanhoMaximo(value: string, max: number): boolean {
  return value.length <= max;
}

/**
 * Validates that a number is within a range
 */
export function validarIntervalo(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

/**
 * Validates URL format
 */
export function validarURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
