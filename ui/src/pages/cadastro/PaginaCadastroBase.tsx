import { Typography, Paper, Box, Button, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";

interface Props {
  titulo: string;
  descricao: string;
}

export default function PaginaCadastroBase({ titulo, descricao }: Props) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {descricao}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Novo
        </Button>
      </Stack>

      <Paper sx={{ p: 3, minHeight: 400 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 10 }}>
          Funcionalidade em desenvolvimento
        </Typography>
      </Paper>
    </Box>
  );
}
