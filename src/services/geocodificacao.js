const BASE = "https://nominatim.openstreetmap.org";

// área de busca ao redor de Ibititá: esquerda, topo, direita, base
const AREA = "-42.07,-11.44,-41.87,-11.64";

function montarEndereco(a = {}, nomeCompleto = "") {
  if (a.road) return a.house_number ? `${a.road}, ${a.house_number}` : a.road;
  return nomeCompleto.split(",")[0] || "";
}

function acharBairro(a = {}) {
  return a.suburb || a.neighbourhood || a.quarter || a.city_district || "";
}

export async function enderecoDoPonto(lat, lng) {
  const url = `${BASE}/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=pt-BR&lat=${lat}&lon=${lng}`;
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error("Falha ao buscar o endereço");
  const dados = await resposta.json();
  return {
    endereco: montarEndereco(dados.address, dados.display_name),
    bairro: acharBairro(dados.address),
  };
}

export async function buscarEndereco(texto) {
  const url =
    `${BASE}/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=br` +
    `&bounded=1&viewbox=${AREA}&accept-language=pt-BR&q=${encodeURIComponent(texto)}`;
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error("Falha na busca");
  const lista = await resposta.json();
  return lista.map((i) => ({
    id: i.place_id,
    titulo: i.name || montarEndereco(i.address, i.display_name),
    descricao: i.display_name,
    lat: parseFloat(i.lat),
    lng: parseFloat(i.lon),
  }));
}