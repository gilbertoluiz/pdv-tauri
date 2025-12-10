import { createTheme } from "@mui/material/styles";

export function criarTema(escuro: boolean) {
  return createTheme({
    palette: {
      mode: escuro ? "dark" : "light",
      primary: { main: "#00897b" }, // teal
      secondary: { main: "#ff9800" }, // orange
    },
  });
}
