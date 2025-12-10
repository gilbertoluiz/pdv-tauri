import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
} from "@mui/material";
import {
  DefinicaoCampo,
  DadosFormulario,
  ErrosFormulario,
  ModoFormulario,
} from "../types/formulario";
import {
  validarCPF,
  validarCNPJ,
  validarEmail,
  validarTelefone,
  validarObrigatorio,
  validarTamanhoMinimo,
  validarTamanhoMaximo,
  validarIntervalo,
  validarURL,
} from "../utils/validadores";
import CampoDocumento from "./campos/CampoDocumento";
import CampoTelefone from "./campos/CampoTelefone";
import CampoEmail from "./campos/CampoEmail";
import CampoMoeda from "./campos/CampoMoeda";

interface FormularioDinamicoProps {
  campos: DefinicaoCampo[];
  modo: ModoFormulario;
  dadosIniciais?: DadosFormulario;
  aoSalvar: (dados: DadosFormulario) => void | Promise<void>;
  aoCancelar?: () => void;
  salvando?: boolean;
  textoSalvar?: string;
  textoCancelar?: string;
}

export default function FormularioDinamico({
  campos,
  modo,
  dadosIniciais = {},
  aoSalvar,
  aoCancelar,
  salvando = false,
  textoSalvar,
  textoCancelar,
}: FormularioDinamicoProps) {
  // Initialize form data with useMemo to avoid recreating on every render
  const dadosIniciaisCalculados = useMemo(() => {
    const dadosInicializados: DadosFormulario = {};
    campos.forEach((campo) => {
      if (dadosIniciais[campo.nome] !== undefined) {
        dadosInicializados[campo.nome] = dadosIniciais[campo.nome];
      } else if (campo.valorPadrao !== undefined) {
        dadosInicializados[campo.nome] = campo.valorPadrao;
      } else {
        // Set default values based on field type
        switch (campo.tipo) {
          case "checkbox":
            dadosInicializados[campo.nome] = false;
            break;
          case "number":
          case "money":
            dadosInicializados[campo.nome] = 0;
            break;
          default:
            dadosInicializados[campo.nome] = "";
        }
      }
    });
    return dadosInicializados;
  }, [campos, dadosIniciais]);

  const [dados, setDados] = useState<DadosFormulario>(dadosIniciaisCalculados);
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const somenteLeitura = modo === "visualizar";

  // Reset form data when dadosIniciaisCalculados changes (e.g., switching between create/edit)
  useEffect(() => {
    setDados(dadosIniciaisCalculados);
    setErros({});
    setTouched({});
  }, [dadosIniciaisCalculados]);

  const validarCampo = (campo: DefinicaoCampo, valor: any): string | undefined => {
    // Check required
    if (campo.obrigatorio) {
      if (campo.tipo === "checkbox") {
        if (!valor) return `${campo.label} é obrigatório`;
      } else if (!validarObrigatorio(String(valor || ""))) {
        return `${campo.label} é obrigatório`;
      }
    }

    // Skip other validations if empty and not required
    if (!valor && !campo.obrigatorio) return undefined;

    // Built-in validations based on field type
    switch (campo.tipo) {
      case "email":
        if (!validarEmail(valor)) return "E-mail inválido";
        break;
      case "cpf":
        if (!validarCPF(valor)) return "CPF inválido";
        break;
      case "cnpj":
        if (!validarCNPJ(valor)) return "CNPJ inválido";
        break;
      case "phone":
        if (!validarTelefone(valor)) return "Telefone inválido";
        break;
      case "url":
        if (!validarURL(valor)) return "URL inválida";
        break;
      case "number":
      case "money":
        if (campo.min !== undefined || campo.max !== undefined) {
          if (!validarIntervalo(Number(valor), campo.min, campo.max)) {
            if (campo.min !== undefined && campo.max !== undefined) {
              return `Valor deve estar entre ${campo.min} e ${campo.max}`;
            } else if (campo.min !== undefined) {
              return `Valor mínimo: ${campo.min}`;
            } else {
              return `Valor máximo: ${campo.max}`;
            }
          }
        }
        break;
    }

    // Custom validations
    if (campo.validacoes) {
      for (const validacao of campo.validacoes) {
        switch (validacao.tipo) {
          case "minLength":
            if (!validarTamanhoMinimo(String(valor), validacao.valor || 0)) {
              return validacao.mensagem;
            }
            break;
          case "maxLength":
            if (!validarTamanhoMaximo(String(valor), validacao.valor || 0)) {
              return validacao.mensagem;
            }
            break;
          case "custom":
            if (validacao.validador && !validacao.validador(valor)) {
              return validacao.mensagem;
            }
            break;
        }
      }
    }

    return undefined;
  };

  const handleChange = (nome: string, valor: any) => {
    setDados((prev) => ({ ...prev, [nome]: valor }));
    
    // Validate on change if field was touched
    if (touched[nome]) {
      const campo = campos.find((c) => c.nome === nome);
      if (campo) {
        const erro = validarCampo(campo, valor);
        setErros((prev) => ({ ...prev, [nome]: erro || "" }));
      }
    }
  };

  const handleBlur = (nome: string) => {
    setTouched((prev) => ({ ...prev, [nome]: true }));
    const campo = campos.find((c) => c.nome === nome);
    if (campo) {
      const erro = validarCampo(campo, dados[nome]);
      setErros((prev) => ({ ...prev, [nome]: erro || "" }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: ErrosFormulario = {};
    let valido = true;

    campos.forEach((campo) => {
      const erro = validarCampo(campo, dados[campo.nome]);
      if (erro) {
        novosErros[campo.nome] = erro;
        valido = false;
      }
    });

    setErros(novosErros);
    return valido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (somenteLeitura) return;

    if (validarFormulario()) {
      await aoSalvar(dados);
    }
  };

  const renderizarCampo = (campo: DefinicaoCampo) => {
    const valor = dados[campo.nome];
    const erro = erros[campo.nome];
    const desabilitado = somenteLeitura || campo.desabilitado;

    // Special field types with custom components
    if (campo.tipo === "cpf" || campo.tipo === "cnpj") {
      return (
        <CampoDocumento
          label={campo.label}
          value={valor || ""}
          onChange={(v) => handleChange(campo.nome, v)}
          tipo={campo.tipo}
          obrigatorio={campo.obrigatorio}
          erro={erro}
          disabled={desabilitado}
          helperText={campo.dica}
        />
      );
    }

    if (campo.tipo === "phone") {
      return (
        <CampoTelefone
          label={campo.label}
          value={valor || ""}
          onChange={(v) => handleChange(campo.nome, v)}
          obrigatorio={campo.obrigatorio}
          erro={erro}
          disabled={desabilitado}
          helperText={campo.dica}
        />
      );
    }

    if (campo.tipo === "email") {
      return (
        <CampoEmail
          label={campo.label}
          value={valor || ""}
          onChange={(v) => handleChange(campo.nome, v)}
          obrigatorio={campo.obrigatorio}
          erro={erro}
          disabled={desabilitado}
          helperText={campo.dica}
        />
      );
    }

    if (campo.tipo === "money") {
      return (
        <CampoMoeda
          label={campo.label}
          value={valor || 0}
          onChange={(v) => handleChange(campo.nome, v)}
          obrigatorio={campo.obrigatorio}
          erro={erro}
          disabled={desabilitado}
          helperText={campo.dica}
          min={campo.min}
          max={campo.max}
        />
      );
    }

    if (campo.tipo === "select") {
      return (
        <FormControl fullWidth error={!!erro} disabled={desabilitado} required={campo.obrigatorio}>
          <InputLabel>{campo.label}</InputLabel>
          <Select
            value={valor || ""}
            onChange={(e) => handleChange(campo.nome, e.target.value)}
            onBlur={() => handleBlur(campo.nome)}
            label={campo.label}
          >
            {campo.opcoes?.map((opcao) => (
              <MenuItem key={opcao.value} value={opcao.value}>
                {opcao.label}
              </MenuItem>
            ))}
          </Select>
          {(erro || campo.dica) && <FormHelperText>{erro || campo.dica}</FormHelperText>}
        </FormControl>
      );
    }

    if (campo.tipo === "checkbox") {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!valor}
              onChange={(e) => handleChange(campo.nome, e.target.checked)}
              disabled={desabilitado}
            />
          }
          label={campo.label}
        />
      );
    }

    if (campo.tipo === "textarea") {
      return (
        <TextField
          label={campo.label}
          value={valor || ""}
          onChange={(e) => handleChange(campo.nome, e.target.value)}
          onBlur={() => handleBlur(campo.nome)}
          error={!!erro}
          helperText={erro || campo.dica}
          disabled={desabilitado}
          required={campo.obrigatorio}
          multiline
          rows={campo.linhas || 4}
          fullWidth
          placeholder={campo.placeholder}
        />
      );
    }

    // Default text-based fields
    const inputType = campo.tipo === "number" ? "number" : campo.tipo === "date" ? "date" : campo.tipo === "datetime" ? "datetime-local" : campo.tipo === "password" ? "password" : "text";

    return (
      <TextField
        label={campo.label}
        type={inputType}
        value={valor || ""}
        onChange={(e) => handleChange(campo.nome, e.target.value)}
        onBlur={() => handleBlur(campo.nome)}
        error={!!erro}
        helperText={erro || campo.dica}
        disabled={desabilitado}
        required={campo.obrigatorio}
        fullWidth
        placeholder={campo.placeholder}
        inputProps={{
          min: campo.min,
          max: campo.max,
        }}
      />
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {campos.map((campo) => (
          <Grid item xs={12} sm={campo.larguraGrid || 12} key={campo.nome}>
            {renderizarCampo(campo)}
          </Grid>
        ))}
      </Grid>

      {!somenteLeitura && (
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={salvando}>
            {salvando ? "Salvando..." : textoSalvar || (modo === "criar" ? "Criar" : "Salvar")}
          </Button>
          {aoCancelar && (
            <Button variant="outlined" onClick={aoCancelar} disabled={salvando}>
              {textoCancelar || "Cancelar"}
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}
