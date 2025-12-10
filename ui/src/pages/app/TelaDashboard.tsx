import { Typography, Grid, Paper, Box } from "@mui/material";
import { TrendingUp, ShoppingCart, AttachMoney, People } from "@mui/icons-material";

interface CardEstatistica {
  titulo: string;
  valor: string;
  icone: JSX.Element;
  cor: string;
}

const estatisticas: CardEstatistica[] = [
  {
    titulo: "Vendas Hoje",
    valor: "R$ 2.450,00",
    icone: <AttachMoney />,
    cor: "#4caf50",
  },
  {
    titulo: "Pedidos",
    valor: "15",
    icone: <ShoppingCart />,
    cor: "#2196f3",
  },
  {
    titulo: "Clientes",
    valor: "127",
    icone: <People />,
    cor: "#ff9800",
  },
  {
    titulo: "Crescimento",
    valor: "+12%",
    icone: <TrendingUp />,
    cor: "#9c27b0",
  },
];

export default function TelaDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Visão geral do seu negócio
      </Typography>

      <Grid container spacing={3}>
        {estatisticas.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.titulo}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                height: 140,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  opacity: 0.1,
                  transform: "scale(2)",
                  color: stat.cor,
                }}
              >
                {stat.icone}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {stat.titulo}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: stat.cor }}>
                {stat.valor}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Atividade Recente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nenhuma atividade registrada ainda.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
