const classes = {
  "Recebida": "status-recebida",
  "Em análise": "status-analise",
  "Em atendimento": "status-atendimento",
  "Resolvida": "status-resolvida",
  "Cancelada": "status-cancelada",
};

export default function StatusChip({ status }) {
  return <span className={`status-chip ${classes[status] || ""}`}>{status}</span>;
}