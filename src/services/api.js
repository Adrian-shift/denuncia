const API_URL = import.meta.env.VITE_API_URL || "";

async function lerErro(response) {
  try {
    const data = await response.json();
    if (data.errors?.length) {
      return data.errors.map((e) => e.defaultMessage).join(" ");
    }
    if (data.message) return data.message;
  } catch {
    // resposta sem JSON
  }

  return "Não foi possível enviar a denúncia. Tente novamente.";
}

export async function listarCategorias() {
  const response = await fetch(`${API_URL}/api/categorias`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as categorias.");
  }

  return response.json();
}

export async function enviarDenuncia(body) {
  let response;

  try {
    // Não definir Content-Type:
    // o navegador configura multipart/form-data e boundary automaticamente.
    response = await fetch(`${API_URL}/api/denuncias`, {
      method: "POST",
      body,
    });
  } catch {
    throw new Error(
      "Sem conexão com o servidor. Verifique se a API está ligada."
    );
  }

  if (!response.ok) {
    throw new Error(await lerErro(response));
  }

  return response.json();
}

export async function listarResumos(protocolos) {
  const lista = encodeURIComponent(protocolos.join(","));
  const response = await fetch(`${API_URL}/api/denuncias?protocolos=${lista}`);
  if (!response.ok) throw new Error("Não foi possível atualizar o histórico.");
  return response.json();
}