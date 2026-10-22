import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { CabecalhoHome } from "../components/Cabecalhos";

export default function Enviada() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // abriu a página direto, sem ter enviado nada
  if (!state?.protocolo) return <Navigate to="/" replace />;

  return (
    <>
      <CabecalhoHome semAjuda />
      <div className="sent-page">
        <div className="sent-check"><Check size={72} strokeWidth={3.5} /></div>
        <p className="sent-text">
          A equipe EcoIbititá analisará sua denúncia em breve. Você pode verificar o status da sua solicitação.
        </p>
        <div className="sent-protocol">
          <small>Número do protocolo</small>
          <strong>{state.protocolo}</strong>
        </div>
        <button className="submit-button sent-button" type="button" onClick={() => navigate("/historico")}>
          Ir para o histórico de denúncias
        </button>
      </div>
    </>
  );
}