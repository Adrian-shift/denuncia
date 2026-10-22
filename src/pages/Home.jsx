import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera, MapPin, Mountain, Armchair, Leaf, Trash2, CircleDot, Cpu, Apple, Bug,
  TriangleAlert, X
} from "lucide-react";
import { CabecalhoHome } from "../components/Cabecalhos";
import { useDenuncia } from "../context/DenunciaContext";
import { listarCategorias, enviarDenuncia } from "../services/api";
import { adicionarAoHistorico } from "../services/historico";

const MAX_FOTOS = 3;

// ícone de cada categoria pelo nome que vem do banco; as demais usam a lixeira
const icones = {
  "Entulho": Mountain,
  "Lixo Doméstico": Trash2,
  "Móveis": Armchair,
  "Pneus": CircleDot,
  "Podas": Leaf,
  "Resíduos Eletrônicos": Cpu,
  "Orgânico": Apple,
  "Mosquito": Bug,
};

export default function Home() {
  const navigate = useNavigate();
  const {
    photos, setPhotos, category, setCategory, details, setDetails,
    bairro, local, limpar,
  } = useDenuncia();

  const [categorias, setCategorias] = useState([]);
  const [notice, setNotice] = useState({ text: "", error: false });
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  function aviso(text, error = false) {
    setNotice({ text, error });
  }

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch((e) => aviso(e.message + " A API está ligada?", true));
  }, []);

  function escolherFoto(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite escolher o mesmo arquivo de novo
    if (!file) return;
    if (photos.length >= MAX_FOTOS) {
      aviso(`O máximo é de ${MAX_FOTOS} fotos.`, true);
      return;
    }
    setPhotos((atuais) => [...atuais, { file, preview: URL.createObjectURL(file) }]);
    aviso("");
  }

  function removerFoto(index) {
    URL.revokeObjectURL(photos[index].preview);
    setPhotos((atuais) => atuais.filter((_, i) => i !== index));
  }

  // provisório: usa o GPS do aparelho. No passo 3 isto vira a tela do mapa.
  /*
  function obterLocalizacao() {
    if (!navigator.geolocation) {
      aviso("A localização não está disponível neste dispositivo.", true);
      return;
    }
    aviso("Solicitando permissão de localização…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocal({ lat: coords.latitude, lng: coords.longitude, endereco: null });
        aviso("");
      },
      () => aviso("Não foi possível obter a localização. Verifique a permissão do navegador.", true)
    );
  }*/

  async function enviar(event) {
    event.preventDefault();
    if (sending) return;

    if (!photos.length) return aviso("Tire pelo menos 1 foto do local.", true);
    if (!local) return aviso("Adicione a localização antes de enviar.", true);
    if (!bairro.trim()) return aviso("Informe o bairro.", true);
    if (!category) return aviso("Selecione o tipo de descarte antes de enviar.", true);

    const body = new FormData();
    body.append("categoriaId", category);
    body.append("latitude", local.lat.toFixed(8));
    body.append("longitude", local.lng.toFixed(8));
    body.append("bairro", bairro.trim());
    if (local.endereco) body.append("endereco", local.endereco);
    if (details.trim()) body.append("descricao", details.trim());
    photos.forEach((p) => body.append("fotos", p.file));

    setSending(true);
    aviso("Enviando denúncia…");
    try {
      const data = await enviarDenuncia(body);
      adicionarAoHistorico({
        id: Date.now(),
        protocolo: data.protocolo,
        categoryName: categorias.find((c) => c.id === category)?.nome,
        bairro: bairro.trim(),
        endereco: local.endereco,
        createdAt: new Date().toLocaleString("pt-BR"),
      });
      limpar();
      navigate("/enviada", { state: { protocolo: data.protocolo } });
    } catch (erro) {
      aviso(erro.message, true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <CabecalhoHome />

      <form className="report-form" onSubmit={enviar}>
        <input
          ref={fileRef}
          className="hidden-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={escolherFoto}
        />

        <div className="photo-grid">
          {photos.map((p, i) => (
            <div className="photo-thumb" key={p.preview}>
              <img src={p.preview} alt={`Foto ${i + 1} selecionada`} />
              <button type="button" className="remove-photo" aria-label="Remover foto" onClick={() => removerFoto(i)}>
                <X size={15} />
              </button>
            </div>
          ))}
          {photos.length < MAX_FOTOS && (
            <button
              type="button"
              className={`photo-add ${photos.length === 0 ? "photo-add-empty" : ""}`}
              onClick={() => fileRef.current?.click()}
            >
              <Camera size={22} strokeWidth={1.8} />
              <strong>{photos.length ? "Outra foto" : "Toque para fotografar"}</strong>
            </button>
          )}
        </div>
        <p className="photo-count">{photos.length} de {MAX_FOTOS} fotos (mínimo 1)</p>

                {local ? (
          <div className="location-card">
            <MapPin size={18} />
            <div className="location-card-text">
              <small>Localização obtida</small>
              <span>
                {[local.endereco, bairro].filter(Boolean).join(" - ") ||
                  `${local.lat.toFixed(5)}, ${local.lng.toFixed(5)}`}
              </span>
            </div>
            <button type="button" className="location-edit" onClick={() => navigate("/local")}>
              Editar
            </button>
          </div>
        ) : (
          <button className="location-button" type="button" onClick={() => navigate("/local")}>
            <MapPin size={15} />
            <span>ADICIONAR LOCALIZAÇÃO</span>
          </button>
        )}

        

        <fieldset className="category-field">
          <legend>O que foi descartado?</legend>
          <div className="category-grid">
            {categorias.map(({ id, nome }) => {
              const Icon = icones[nome] || Trash2;
              return (
                <button
                  className={`category-tile ${category === id ? "selected" : ""}`}
                  type="button"
                  key={id}
                  onClick={() => setCategory(id)}
                  aria-pressed={category === id}
                >
                  <Icon strokeWidth={1.7} />
                  <span>{nome}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <textarea
          className="details-input"
          placeholder="Adicione detalhes se quiser (opcional)"
          maxLength={5000}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
        />

        <button className="history-link" type="button" onClick={() => navigate("/historico")}>
          Ver histórico de denúncias
        </button>

        {notice.text && (
          <p className={`notice ${notice.error ? "error" : ""}`} role="status">{notice.text}</p>
        )}

        <button className="submit-button" type="submit" disabled={sending}>
          <TriangleAlert size={14} strokeWidth={1.8} />
          {sending ? "Enviando…" : "Enviar Denúncia"}
        </button>
      </form>
    </>
  );
}