import { TextField } from "@mui/material";
import { useState } from "react";
import { validarEmail } from "../../utils/validadores";

interface CampoEmailProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  obrigatorio?: boolean;
  erro?: string;
  disabled?: boolean;
  helperText?: string;
}

export default function CampoEmail({
  label,
  value,
  onChange,
  obrigatorio,
  erro,
  disabled,
  helperText,
}: CampoEmailProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const validar = (): string | undefined => {
    if (!value && obrigatorio) {
      return `${label} é obrigatório`;
    }
    if (value && touched && !validarEmail(value)) {
      return "E-mail inválido";
    }
    return erro;
  };

  const erroValidacao = validar();

  return (
    <TextField
      label={label}
      type="email"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!erroValidacao}
      helperText={erroValidacao || helperText}
      disabled={disabled}
      required={obrigatorio}
      fullWidth
      placeholder="exemplo@email.com"
    />
  );
}
