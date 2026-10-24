import { useEffect, useState } from "react";
import { CabecalhoVoltar } from "../components/Cabecalhos";
import { carregarHistorico } from "../services/historico";
import { listarResumos } from "../services/api";

const classeDoStatus = {
  "Recebida": "status-recebida",
  "Em análise": "status-analise",
  "Em atendimento": "status-atendimento",
  "Resolvida": "status-resolvida",
  "Cancelada": "status-cancelada",
};

export default function Historico() {
  // só entradas com protocolo; a API aceita no máximo 50 por consulta
  const locais = carregarHistorico().filter((r) => r.protocolo).slice(0, 50);
  const [resumos, setResumos] = useState({}); // protocolo -> dados da API
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (!locais.length) return;
    listarResumos(locais.map((r) => r.protocolo))
      .then((lista) => setResumos(Object.fromEntries(lista.map((r) => [r.protocolo, r]))))
      .catch((e) => setAviso(`${e.message} Mostrando os dados salvos neste aparelho.`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CabecalhoVoltar titulo="Histórico de Denúncias" />
      <div className="history-page">
        {aviso && <p className="notice error">{aviso}</p>}

        {locais.length ? (
          locais.map((local) => {
            const r = resumos[local.protocolo];
            const endereco = r?.endereco ?? local.endereco;
            const bairro = r?.bairro ?? local.bairro;
            return (
              <article className="history-card" key={local.id}>
                <div className="history-card-top">
                  <strong>{local.protocolo}</strong>
                  {r && <span className={`status-chip ${classeDoStatus[r.status] || ""}`}>{r.status}</span>}
                </div>
                <span>{[endereco, bairro].filter(Boolean).join(" - ")}</span>
                <small>{local.createdAt}</small>
              </article>
            );
          })
        ) : (
          <p className="empty-history">Nenhuma denúncia registrada neste dispositivo.</p>
        )}
      </div>
    </>
  );
}