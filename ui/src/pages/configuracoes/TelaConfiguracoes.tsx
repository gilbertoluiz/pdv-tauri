import { Typography, Paper, Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import TelaAlterarSenha from "../auth/TelaAlterarSenha";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TelaConfiguracoes() {
  const [tabAtiva, setTabAtiva] = useState(0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Configurações
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Gerencie as configurações do sistema
      </Typography>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabAtiva}
          onChange={(_, newValue) => setTabAtiva(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Geral" />
          <Tab label="Segurança" />
          <Tab label="Sistema" />
        </Tabs>

        <TabPanel value={tabAtiva} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações Gerais
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configurações gerais do sistema em desenvolvimento.
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabAtiva} index={1}>
          <Box sx={{ p: 3 }}>
            <TelaAlterarSenha />
          </Box>
        </TabPanel>

        <TabPanel value={tabAtiva} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações do Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Banco de dados, backup e outras configurações técnicas.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
