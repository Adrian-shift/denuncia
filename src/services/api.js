async function lerErro(response) {
  try {
    const data = await response.json();
    if (data.errors?.length) return data.errors.map((e) => e.defaultMessage).join(" ");
    if (data.message) return data.message;
  } catch {
    // resposta sem JSON
  }
  return "Não foi possível enviar a denúncia. Tente novamente.";
}

export async function listarCategorias() {
  const response = await fetch("/api/categorias");
  if (!response.ok) throw new Error("Não foi possível carregar as categorias.");
  return response.json();
}

export async function enviarDenuncia(body) {
  let response;
  try {
    // sem Content-Type: o navegador monta o multipart sozinho
    response = await fetch("/api/denuncias", { method: "POST", body });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique se a API está ligada.");
  }
  if (!response.ok) throw new Error(await lerErro(response));
  return response.json();
}