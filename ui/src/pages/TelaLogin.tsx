import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TelaLogin() {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("admin");
  const nav = useNavigate();

  const entrar = () => {
    if (user === "admin" && pass === "admin") {
      nav("/pedidos");
    } else {
      alert("Login invalido");
    }
  };

  return (
    <Stack spacing={2} maxWidth={420}>
      <TextField
        label="Usuario"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        size="small"
      />
      <TextField
        label="Senha"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        size="small"
      />
      <Button variant="contained" onClick={entrar}>
        Entrar
      </Button>
    </Stack>
  );
}
