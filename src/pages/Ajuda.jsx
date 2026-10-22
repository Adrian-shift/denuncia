import { CabecalhoVoltar } from "../components/Cabecalhos";

export default function Ajuda() {
  return (
    <>
      <CabecalhoVoltar titulo="Ajuda ao usuário" />
      <div className="help-page">
        <ol className="help-list">
          <li><strong>Registrar a ocorrência:</strong> na tela inicial, toque na área superior para tirar ou enviar de 1 a 3 fotos do local do descarte irregular.</li>
          <li><strong>Definir a localização:</strong> toque em "Adicionar localização", pesquise o endereço ou arraste o mapa até que o pino vermelho esteja no local exato e confirme.</li>
          <li><strong>Classificar e detalhar:</strong> escolha a categoria do resíduo e, se quiser, escreva informações adicionais. Em seguida, toque em "Enviar Denúncia".</li>
          <li><strong>Confirmação:</strong> sua denúncia é registrada e o sistema exibe o número de protocolo.</li>
          <li><strong>Acompanhamento:</strong> para verificar o andamento, abra o histórico de denúncias e selecione um protocolo para ver o status atual da solicitação.</li>
        </ol>
      </div>
    </>
  );
}