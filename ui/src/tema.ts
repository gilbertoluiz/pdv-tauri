import { createTheme, ThemeOptions } from "@mui/material/styles";

export interface CoresPersonalizadas {
  primaria: string;
  secundaria: string;
}

const coresPreDefinidas: Record<string, CoresPersonalizadas> = {
  padrao: {
    primaria: "#00897b", // teal
    secundaria: "#ff9800", // orange
  },
  azul: {
    primaria: "#1976d2", // blue
    secundaria: "#f50057", // pink
  },
  verde: {
    primaria: "#388e3c", // green
    secundaria: "#ffa726", // orange
  },
  roxo: {
    primaria: "#7b1fa2", // purple
    secundaria: "#26c6da", // cyan
  },
  vermelho: {
    primaria: "#d32f2f", // red
    secundaria: "#fbc02d", // yellow
  },
};

export function obterCoresPreDefinidas(): Record<string, CoresPersonalizadas> {
  return coresPreDefinidas;
}

export function criarTema(escuro: boolean, cores: CoresPersonalizadas = coresPreDefinidas.padrao) {
  const opcoesTema: ThemeOptions = {
    palette: {
      mode: escuro ? "dark" : "light",
      primary: { main: cores.primaria },
      secondary: { main: cores.secundaria },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  };

  return createTheme(opcoesTema);
}
