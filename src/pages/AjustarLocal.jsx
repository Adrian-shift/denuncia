import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, MapPin, Search, X } from "lucide-react";
import { CabecalhoVoltar } from "../components/Cabecalhos";
import { useDenuncia } from "../context/DenunciaContext";
import { buscarEndereco, enderecoDoPonto } from "../services/geocodificacao";

const CENTRO_IBITITA = [-11.5444, -41.9717];

export default function AjustarLocal() {
  const navigate = useNavigate();
  const { local, setLocal, bairro, setBairro } = useDenuncia();

  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  const [endereco, setEndereco] = useState(local?.endereco ?? "");
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [bairroLocal, setBairroLocal] = useState(bairro);
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const inicio = local ? [local.lat, local.lng] : CENTRO_IBITITA;
    const map = L.map(canvasRef.current, { zoomControl: false }).setView(inicio, local ? 18 : 16);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;

    let timer;
    let contador = 0;

    // quando o mapa para de mexer, descobre o endereço do ponto central
    const atualizar = () => {
      clearTimeout(timer);
      setBuscandoEndereco(true);
      timer = setTimeout(async () => {
        const id = ++contador;
        const { lat, lng } = map.getCenter();
        try {
          const r = await enderecoDoPonto(lat, lng);
          if (id !== contador) return; // chegou uma resposta mais nova
          setEndereco(r.endereco);
          if (r.bairro) setBairroLocal(r.bairro);
        } catch {
          if (id === contador) setEndereco("");
        } finally {
          if (id === contador) setBuscandoEndereco(false);
        }
      }, 700);
    };

    map.on("moveend", atualizar);
    atualizar();

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buscar(event) {
    event.preventDefault();
    if (!busca.trim()) return;
    setMsg("Buscando…");
    try {
      const lista = await buscarEndereco(busca.trim());
      setResultados(lista);
      setMsg(lista.length ? "" : "Nenhum endereço encontrado. Arraste o mapa até o local.");
    } catch {
      setMsg("Não foi possível buscar agora. Arraste o mapa até o local.");
    }
  }

  function escolher(resultado) {
    mapRef.current?.setView([resultado.lat, resultado.lng], 18);
    setResultados([]);
  }

  function limparBusca() {
    setBusca("");
    setResultados([]);
    setMsg("");
  }

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setMsg("A localização não está disponível neste dispositivo.");
      return;
    }
    setMsg("Solicitando permissão de localização…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        mapRef.current?.setView([coords.latitude, coords.longitude], 18);
        setMsg("");
      },
      () => setMsg("Não foi possível obter a localização. Verifique a permissão do navegador.")
    );
  }

  function confirmar() {
    if (!bairroLocal.trim()) {
      setMsg("Informe o bairro.");
      return;
    }
    const { lat, lng } = mapRef.current.getCenter();
    setLocal({ lat, lng, endereco: endereco || null });
    setBairro(bairroLocal.trim());
    navigate("/denunciar");
  }

  const textoDoPino = buscandoEndereco
    ? "Buscando endereço…"
    : endereco || "Endereço não encontrado";

  return (
    <>
      <CabecalhoVoltar titulo="Ajustar Local" />

      <div className="map-screen">
        <div className="map-wrap">
          <div className="map-canvas" ref={canvasRef} />

          <div className="map-top">
            <form className="map-search" onSubmit={buscar}>
              <Search size={17} />
              <input
                type="text"
                placeholder="Digite o endereço ou rua…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <button type="button" aria-label="Limpar busca" onClick={limparBusca}>
                  <X size={17} />
                </button>
              )}
            </form>

            <button type="button" className="map-chip" onClick={usarMinhaLocalizacao}>
              <LocateFixed size={14} />
              Usar minha localização exata
            </button>

            {resultados.length > 0 && (
              <ul className="map-results">
                {resultados.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => escolher(r)}>
                      <strong>{r.titulo}</strong>
                      <small>{r.descricao}</small>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="map-label">{textoDoPino}</div>
          <div className="map-pin" aria-hidden="true">
            <MapPin />
          </div>
        </div>

        <div className="map-sheet">
          <p className="map-hint">Arraste o mapa para posicionar o pino com precisão.</p>
          {msg && <p className="map-message">{msg}</p>}
          <input
            className="text-input"
            type="text"
            placeholder="Bairro"
            maxLength={100}
            value={bairroLocal}
            onChange={(e) => setBairroLocal(e.target.value)}
          />
          <button className="submit-button" type="button" onClick={confirmar}>
            Confirmar Este Local
          </button>
        </div>
      </div>
    </>
  );
}