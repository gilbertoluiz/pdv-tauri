import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

interface DialogoConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  textoConfirmar?: string;
  textoCancelar?: string;
  corConfirmar?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export default function DialogoConfirmacao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  corConfirmar = "primary",
}: DialogoConfirmacaoProps) {
  return (
    <Dialog open={aberto} onClose={onCancelar}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensagem}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelar} color="inherit">
          {textoCancelar}
        </Button>
        <Button onClick={onConfirmar} variant="contained" color={corConfirmar} autoFocus>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
