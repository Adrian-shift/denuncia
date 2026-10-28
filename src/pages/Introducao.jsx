
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, MapPin, Send, Leaf } from "lucide-react";

export default function Introducao() {
  const navigate = useNavigate();

  return (
    <div className="intro">
      <div className="intro-conteudo">
        <header className="intro-topo">
          <img
            src="/logo.png"
            alt="EcoIbititá"
            className="intro-logo"
          />
        </header>

        <section className="intro-principal">
          <div className="intro-etiqueta">
            Juntos por uma cidade mais limpa
          </div>

          <h1>
            Uma cidade mais limpa
            <span> começa com você.</span>
          </h1>

          <p>
            Conheça o EcoIbititá, uma plataforma
            que conecta você à gestão da limpeza
            urbana. Encontrou lixo descartado
            irregularmente? Ajude a transformar
            nossa cidade!
          </p>

          <button
            className="intro-botao"
            onClick={() => navigate("/denunciar")}
          >
            <span>Denunciar Lixo</span>
            <ArrowRight size={23} />
          </button>
        </section>

        <section className="intro-passos">
          <h2>Como funciona?</h2>

          <div className="intro-passos-grid">
            <div className="intro-passo">
              <div className="intro-passo-icone">
                <Camera size={23} />
              </div>
              <strong>01</strong>
              <span>Tire uma foto</span>
            </div>

            <div className="intro-passo">
              <div className="intro-passo-icone">
                <MapPin size={23} />
              </div>
              <strong>02</strong>
              <span>Informe o local</span>
            </div>

            <div className="intro-passo">
              <div className="intro-passo-icone">
                <Send size={23} />
              </div>
              <strong>03</strong>
              <span>Envie a denúncia</span>
            </div>
          </div>
        </section>

        <footer className="intro-rodape">
          EcoIbititá • Cuidando da nossa cidade
        </footer>
      </div>
    </div>
  );
}
