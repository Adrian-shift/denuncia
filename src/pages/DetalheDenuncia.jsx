import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Check, Clock, MapPin, Tag, User, X } from "lucide-react";
import { CabecalhoVoltar } from "../components/Cabecalhos";
import StatusChip from "../components/StatusChip";
import { buscarDenuncia } from "../services/api";

// texto curto de cada etapa da linha do tempo
const textos = {
  "Recebida": "Sua denúncia foi registrada e aguarda a análise da equipe.",
  "Em análise": "Sua denúncia está sendo verificada pela equipe responsável.",
  "Em atendimento": "Uma equipe foi designada para resolver a ocorrência.",
  "Resolvida": "A ocorrência foi resolvida. Obrigado por colaborar com Ibititá!",
  "Cancelada": "Esta denúncia foi cancelada.",
};

function formatarData(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${data} às ${hora}`;
}

function classeDaEtapa(etapa) {
  if (etapa.status === "Cancelada") return "cancelled";
  if (etapa.situacao === "CONCLUIDA") return "done";
  if (etapa.situacao === "ATUAL") return "current";
  return "waiting";
}

function iconeDaEtapa(etapa) {
  if (etapa.status === "Cancelada") return <X size={16} strokeWidth={3} />;
  if (etapa.situacao === "CONCLUIDA") return <Check size={16} strokeWidth={3} />;
  return <Clock size={16} strokeWidth={2.4} />;
}

export default function DetalheDenuncia() {
  const { protocolo } = useParams();
  const [d, setD] = useState(null);
  const [erro, setErro] = useState("");
  const [foto, setFoto] = useState(0);

  useEffect(() => {
    setD(null);
    setErro("");
    setFoto(0);
    buscarDenuncia(protocolo)
      .then(setD)
      .catch((e) => setErro(e.message));
  }, [protocolo]);

  return (
    <>
      <CabecalhoVoltar titulo="Descrição da Denúncia" para="/historico" />

      <div className="detail-page">
        {erro && <p className="notice error">{erro}</p>}
        {!erro && !d && <p className="empty-history">Carregando…</p>}

        {d && (
          <>
            <div className="detail-heading">
              <strong>{d.protocolo}</strong>
              <StatusChip status={d.status} />
            </div>

            <h2 className="detail-title">Descrição da Denúncia:</h2>
            {d.fotos.length > 0 && (
              <>
                <img className="detail-photo" src={d.fotos[foto]} alt={`Foto ${foto + 1} da denúncia`} />
                {d.fotos.length > 1 && (
                  <div className="detail-thumbs">
                    {d.fotos.map((url, i) => (
                      <button
                        type="button"
                        key={url}
                        className={i === foto ? "active" : ""}
                        onClick={() => setFoto(i)}
                        aria-label={`Ver foto ${i + 1}`}
                      >
                        <img src={url} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <p className="detail-text">{d.descricao || "Sem descrição informada."}</p>

            <h2 className="detail-title">Status da Denúncia</h2>
            <ol className="timeline">
              {d.linhaDoTempo.map((etapa) => (
                <li key={etapa.status} className={`timeline-item ${classeDaEtapa(etapa)}`}>
                  <span className="timeline-marker">{iconeDaEtapa(etapa)}</span>
                  <div className="timeline-body">
                    <strong>{etapa.status}</strong>
                    {etapa.situacao === "AGUARDANDO" ? (
                      <small>Aguardando</small>
                    ) : (
                      <>
                        <p>{textos[etapa.status]}</p>
                        {etapa.data && <small>{formatarData(etapa.data)}</small>}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="detail-title">Informações Adicionais</h2>
            <ul className="info-list">
              <li>
                <CalendarDays size={20} />
                <div><small>Data da denúncia</small><strong>{formatarData(d.dataRegistro)}</strong></div>
              </li>
              <li>
                <Clock size={20} />
                <div><small>Última atualização</small><strong>{formatarData(d.dataAtualizacao)}</strong></div>
              </li>
              <li>
                <Tag size={20} />
                <div><small>Categoria</small><strong>{d.categoria}</strong></div>
              </li>
              <li>
                <MapPin size={20} />
                <div>
                  <small>Local</small>
                  <strong>{[d.endereco, d.bairro].filter(Boolean).join(" - ")}</strong>
                </div>
              </li>
              <li>
                <User size={20} />
                <div><small>Enviada por</small><strong>{d.anonima ? "Anônimo" : "Cidadão"}</strong></div>
              </li>
            </ul>
          </>
        )}
      </div>
    </>
  );
}