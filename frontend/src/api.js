const URL_BASE = "http://localhost:5000/api";

function pegarToken() {
  return localStorage.getItem("fintrack_token");
}

function cabecalhosAutenticados() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${pegarToken()}`,
  };
}

export async function loginApi(email, senha) {
  const resposta = await fetch(`${URL_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return resposta.json();
}

export async function registrarApi(nome, email, senha) {
  const resposta = await fetch(`${URL_BASE}/auth/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  return resposta.json();
}

export async function listarContasApi() {
  const resposta = await fetch(`${URL_BASE}/contas/`, {
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}

export async function criarContaApi(dados) {
  const resposta = await fetch(`${URL_BASE}/contas/`, {
    method: "POST",
    headers: cabecalhosAutenticados(),
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

export async function editarContaApi(contaId, dados) {
  const resposta = await fetch(`${URL_BASE}/contas/${contaId}`, {
    method: "PUT",
    headers: cabecalhosAutenticados(),
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

export async function pagarContaApi(contaId) {
  const resposta = await fetch(`${URL_BASE}/contas/${contaId}/pagar`, {
    method: "PATCH",
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}

export async function excluirContaApi(contaId) {
  const resposta = await fetch(`${URL_BASE}/contas/${contaId}`, {
    method: "DELETE",
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}

export async function listarAssinaturasApi() {
  const resposta = await fetch(`${URL_BASE}/assinaturas/`, {
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}

export async function criarAssinaturaApi(dados) {
  const resposta = await fetch(`${URL_BASE}/assinaturas/`, {
    method: "POST",
    headers: cabecalhosAutenticados(),
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

export async function cancelarAssinaturaApi(assinaturaId) {
  const resposta = await fetch(`${URL_BASE}/assinaturas/${assinaturaId}`, {
    method: "DELETE",
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}

export async function listarMetasApi() {
  const resposta = await fetch(`${URL_BASE}/metas/`, {
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}

export async function criarMetaApi(dados) {
  const resposta = await fetch(`${URL_BASE}/metas/`, {
    method: "POST",
    headers: cabecalhosAutenticados(),
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

export async function depositarMetaApi(metaId, valor) {
  const resposta = await fetch(`${URL_BASE}/metas/${metaId}/depositar`, {
    method: "PATCH",
    headers: cabecalhosAutenticados(),
    body: JSON.stringify({ valor }),
  });
  return resposta.json();
}

export async function excluirMetaApi(metaId) {
  const resposta = await fetch(`${URL_BASE}/metas/${metaId}`, {
    method: "DELETE",
    headers: cabecalhosAutenticados(),
  });
  return resposta.json();
}