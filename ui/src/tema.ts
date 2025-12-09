import { createTheme } from "@mui/material/styles";
export const criarTema = (escuro: boolean) =>
  createTheme({
    palette: { mode: escuro ? "dark" : "light" },
    shape: { borderRadius: 10 }
  });