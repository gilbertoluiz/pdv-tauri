import { TextField } from "@mui/material";
import { useState } from "react";
import { formatarTelefone } from "../../utils/formatadores";
import { validarTelefone } from "../../utils/validadores";

interface CampoTelefoneProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  obrigatorio?: boolean;
  erro?: string;
  disabled?: boolean;
  helperText?: string;
}

export default function CampoTelefone({
  label,
  value,
  onChange,
  obrigatorio,
  erro,
  disabled,
  helperText,
}: CampoTelefoneProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Format as user types
    const formatted = formatarTelefone(inputValue);
    onChange(formatted);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const validar = (): string | undefined => {
    if (!value && obrigatorio) {
      return `${label} é obrigatório`;
    }
    if (value && touched && !validarTelefone(value)) {
      return "Telefone inválido";
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
      placeholder="(00) 00000-0000"
      inputProps={{
        maxLength: 20,
      }}
    />
  );
}
