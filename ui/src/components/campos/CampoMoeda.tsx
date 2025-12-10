import { TextField, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import { formatarMoeda, parseMoeda } from "../../utils/formatadores";

interface CampoMoedaProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  obrigatorio?: boolean;
  erro?: string;
  disabled?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
}

export default function CampoMoeda({
  label,
  value,
  onChange,
  obrigatorio,
  erro,
  disabled,
  helperText,
  min,
  max,
}: CampoMoedaProps) {
  const [displayValue, setDisplayValue] = useState(formatarMoeda(value));

  // Sync displayValue when value prop changes
  useEffect(() => {
    setDisplayValue(formatarMoeda(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove all non-numeric characters
    const numeric = inputValue.replace(/\D/g, "");
    
    // Convert cents to main currency unit
    const numericValue = numeric ? parseFloat(numeric) / 100 : 0;

    // Update parent with value in main currency unit
    onChange(numericValue);
    
    // Format for display (pass numeric string which will be converted to cents-based value)
    setDisplayValue(formatarMoeda(numeric));
  };

  const handleBlur = () => {
    // Ensure proper formatting on blur
    setDisplayValue(formatarMoeda(value));
  };

  const validar = (): string | undefined => {
    if (!value && value !== 0 && obrigatorio) {
      return `${label} é obrigatório`;
    }
    if (min !== undefined && value < min) {
      return `Valor mínimo: ${formatarMoeda(min)}`;
    }
    if (max !== undefined && value > max) {
      return `Valor máximo: ${formatarMoeda(max)}`;
    }
    return erro;
  };

  const erroValidacao = validar();

  return (
    <TextField
      label={label}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!erroValidacao}
      helperText={erroValidacao || helperText}
      disabled={disabled}
      required={obrigatorio}
      fullWidth
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
      }}
    />
  );
}
