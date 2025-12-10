import { TextField } from "@mui/material";
import { useState } from "react";
import { formatarCPF, formatarCNPJ } from "../../utils/formatadores";
import { validarCPF, validarCNPJ } from "../../utils/validadores";

interface CampoDocumentoProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tipo: "cpf" | "cnpj";
  obrigatorio?: boolean;
  erro?: string;
  disabled?: boolean;
  helperText?: string;
}

export default function CampoDocumento({
  label,
  value,
  onChange,
  tipo,
  obrigatorio,
  erro,
  disabled,
  helperText,
}: CampoDocumentoProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Format as user types
    const formatted = tipo === "cpf" ? formatarCPF(inputValue) : formatarCNPJ(inputValue);
    onChange(formatted);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const validar = (): string | undefined => {
    if (!value && obrigatorio) {
      return `${label} é obrigatório`;
    }
    if (value && touched) {
      const isValid = tipo === "cpf" ? validarCPF(value) : validarCNPJ(value);
      if (!isValid) {
        return `${tipo.toUpperCase()} inválido`;
      }
    }
    return erro;
  };

  const erroValidacao = validar();

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!erroValidacao}
      helperText={erroValidacao || helperText}
      disabled={disabled}
      required={obrigatorio}
      fullWidth
      placeholder={tipo === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
      inputProps={{
        maxLength: tipo === "cpf" ? 14 : 18,
      }}
    />
  );
}
