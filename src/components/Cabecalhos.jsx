import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleHelp, Leaf } from "lucide-react";

export function CabecalhoHome({ semAjuda = false }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-copy">
          <strong>EcoIbititá</strong>
          <span>Prefeitura Municipal de Ibititá</span>
        </div>
      </div>
      {!semAjuda && (
        <Link className="help-button" to="/ajuda" aria-label="Ajuda">
          <CircleHelp size={29} strokeWidth={2.8} />
        </Link>
      )}
    </header>
  );
}

export function CabecalhoVoltar({ titulo, para = "/denunciar" }) {
  const navigate = useNavigate();
  return (
    <header className="app-header simple">
      <button type="button" className="back-button" aria-label="Voltar" onClick={() => navigate(para)}>
        <ArrowLeft size={22} />
      </button>
      <h1 className="header-title">{titulo}</h1>
    </header>
  );
}