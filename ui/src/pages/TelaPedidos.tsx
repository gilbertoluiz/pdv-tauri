import { useState } from "react";
import {
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

type Pedido = {
  id: number;
  documentoCliente: string;
  status: string;
  criadoEm: string;
};

export default function TelaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const novo = () => {
    const p: Pedido = {
      id: Date.now(),
      documentoCliente: "00000000000",
      status: "Rascunho",
      criadoEm: new Date().toISOString(),
    };
    setPedidos((prev) => [p, ...prev]);
  };

  const excluir = (id: number) =>
    setPedidos((prev) => prev.filter((p) => p.id !== id));

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={novo}>
          Novo
        </Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Criado em</TableCell>
            <TableCell>Acoes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.documentoCliente}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>{new Date(p.criadoEm).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  color="error"
                  onClick={() => excluir(p.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
