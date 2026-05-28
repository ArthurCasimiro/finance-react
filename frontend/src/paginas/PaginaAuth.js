import { useState } from "react";
import { loginApi, registrarApi } from "../api";

export default function PaginaAuth({ aoLogar }) {
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setErro("");
    setCarregando(true);

    try {
      let dados;

      if (modo === "login") {
        dados = await loginApi(email, senha);
      } else {
        dados = await registrarApi(nome, email, senha);
      }

      if (dados.erro) {
        setErro(dados.erro);
      } else {
        localStorage.setItem("fintrack_token", dados.token);
        localStorage.setItem("fintrack_usuario", JSON.stringify(dados.usuario));
        aoLogar(dados.usuario);
      }
    } catch {
      setErro("Erro de conexão com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  function teclaEnter(e) {
    if (e.key === "Enter") enviar();
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">FinTrack</div>
        <p className="auth-sub">
          {modo === "login" ? "Entre na sua conta" : "Crie sua conta grátis"}
        </p>

        {erro && <div className="erro-msg">{erro}</div>}

        {modo === "cadastro" && (
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              onKeyDown={teclaEnter}
            />
          </div>
        )}

        <div className="campo">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            onKeyDown={teclaEnter}
          />
        </div>

        <div className="campo">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            onKeyDown={teclaEnter}
          />
        </div>

        <button
          className="btn btn-primario"
          onClick={enviar}
          disabled={carregando}
        >
          {carregando ? "Aguarde..." : modo === "login" ? "Entrar" : "Cadastrar"}
        </button>

        <button
          className="btn btn-secundario"
          onClick={() => { setModo(modo === "login" ? "cadastro" : "login"); setErro(""); }}
        >
          {modo === "login"
            ? "Não tem conta? Cadastre-se"
            : "Já tem conta? Faça login"}
        </button>
      </div>
    </div>
  );
}
