import { CabecalhoVoltar } from "../components/Cabecalhos";
import { carregarHistorico } from "../services/historico";

export default function Historico() {
  const reports = carregarHistorico();
  return (
    <>
      <CabecalhoVoltar titulo="Histórico de Denúncias" />
      <div className="history-page">
        {reports.length ? (
          reports.map((r) => (
            <article className="history-card" key={r.id}>
              <strong>{r.protocolo}</strong>
              <span>{[r.endereco, r.bairro].filter(Boolean).join(" - ")}</span>
              <small>{r.createdAt}</small>
            </article>
          ))
        ) : (
          <p className="empty-history">Nenhuma denúncia registrada neste dispositivo.</p>
        )}
      </div>
    </>
  );
}