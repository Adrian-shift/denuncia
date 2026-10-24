import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CabecalhoVoltar } from "../components/Cabecalhos";
import StatusChip from "../components/StatusChip";
import { carregarHistorico } from "../services/historico";
import { listarResumos, listarPublicas } from "../services/api";

const FILTROS = [
  { rotulo: "Todas", valor: "" },
  { rotulo: "Recebida", valor: "RECEBIDA" },
  { rotulo: "Em análise", valor: "EM_ANALISE" },
  { rotulo: "Em atendimento", valor: "EM_ATENDIMENTO" },
  { rotulo: "Resolvida", valor: "RESOLVIDA" },
];

function dataCurta(iso) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

// denúncias feitas neste aparelho: abrem o detalhe completo
function MinhasDenuncias() {
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
        <p className="empty-history">
          Nenhuma denúncia registrada neste aparelho. Veja as de todos na aba ao lado.
        </p>
      )}
    </>
  );
}

// todas as denúncias do município: só resumo, sem foto nem protocolo
function TodasDenuncias() {
  const [filtro, setFiltro] = useState("");
  const [itens, setItens] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [ultima, setUltima] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const pedido = useRef(0); // ignora respostas antigas se o filtro mudar rápido

  async function carregar(status, numeroPagina) {
    const id = ++pedido.current;
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarPublicas({ status, pagina: numeroPagina });
      if (id !== pedido.current) return;
      setItens((atuais) => (numeroPagina === 0 ? dados.itens : [...atuais, ...dados.itens]));
      setPagina(dados.pagina);
      setUltima(dados.ultima);
    } catch (e) {
      if (id === pedido.current) setErro(e.message);
    } finally {
      if (id === pedido.current) setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(filtro, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  return (
    <>
      <div className="filter-row">
        {FILTROS.map((f) => (
          <button
            type="button"
            key={f.valor}
            className={`filter-chip ${filtro === f.valor ? "active" : ""}`}
            onClick={() => setFiltro(f.valor)}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      {erro && <p className="notice error">{erro}</p>}

      {itens.map((d, i) => (
        <article className="history-card" key={i}>
          <div className="history-card-content">
            <div className="history-card-top">
              <strong>{d.categoria}</strong>
              <StatusChip status={d.status} />
            </div>
            <span>{d.bairro}</span>
            <small>{dataCurta(d.dataRegistro)}</small>
          </div>
        </article>
      ))}

      {!carregando && !erro && itens.length === 0 && (
        <p className="empty-history">Nenhuma denúncia encontrada.</p>
      )}

      {!ultima && (
        <button type="button" className="load-more" disabled={carregando} onClick={() => carregar(filtro, pagina + 1)}>
          {carregando ? "Carregando…" : "Carregar mais"}
        </button>
      )}
    </>
  );
}

export default function Historico() {
  // quem já denunciou neste aparelho começa em "Minhas"; os demais, em "Todas"
  const [aba, setAba] = useState(() =>
    carregarHistorico().some((r) => r.protocolo) ? "minhas" : "todas"
  );

  return (
    <>
      <CabecalhoVoltar titulo="Histórico de Denúncias" />
      <div className="history-page">
        <div className="history-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={aba === "minhas"}
                  className={aba === "minhas" ? "active" : ""} onClick={() => setAba("minhas")}>
            Minhas denúncias
          </button>
          <button type="button" role="tab" aria-selected={aba === "todas"}
                  className={aba === "todas" ? "active" : ""} onClick={() => setAba("todas")}>
            Todas as denúncias
          </button>
        </div>

        {aba === "minhas" ? <MinhasDenuncias /> : <TodasDenuncias />}
      </div>
    </>
  );
}