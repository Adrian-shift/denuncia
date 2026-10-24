import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CabecalhoVoltar } from "../components/Cabecalhos";
import StatusChip from "../components/StatusChip";
import { carregarHistorico } from "../services/historico";
import { listarResumos } from "../services/api";

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
              <Link className="history-card" to={`/denuncia/${local.protocolo}`} key={local.id}>
                <div className="history-card-content">
                  <div className="history-card-top">
                    <strong>{local.protocolo}</strong>
                    {r && <StatusChip status={r.status} />}
                  </div>
                  <span>{[endereco, bairro].filter(Boolean).join(" - ")}</span>
                  <small>{local.createdAt}</small>
                </div>
                <ChevronRight size={18} />
              </Link>
            );
          })
        ) : (
          <p className="empty-history">Nenhuma denúncia registrada neste dispositivo.</p>
        )}
      </div>
    </>
  );
}