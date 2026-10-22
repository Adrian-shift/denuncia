const CHAVE = "ecoibitita-reports";

export function carregarHistorico() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "[]");
  } catch {
    return [];
  }
}

export function adicionarAoHistorico(item) {
  localStorage.setItem(CHAVE, JSON.stringify([item, ...carregarHistorico()]));
}