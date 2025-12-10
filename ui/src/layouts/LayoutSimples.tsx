import { ReactNode } from "react";
import { Box, Container, Paper } from "@mui/material";

interface LayoutSimpleProps {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function LayoutSimples({ children, maxWidth = "sm" }: LayoutSimpleProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth={maxWidth}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
