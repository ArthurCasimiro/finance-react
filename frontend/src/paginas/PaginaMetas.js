import { useEffect, useState } from "react";
import {
  listarMetasApi,
  criarMetaApi,
  depositarMetaApi,
  excluirMetaApi,
} from "../api";

export default function PaginaMetas() {
  const [metas, setMetas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");

  const [depositando, setDepositando] = useState(null);
  const [valorDeposito, setValorDeposito] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    const dados = await listarMetasApi();
    setMetas(Array.isArray(dados) ? dados : []);
    setCarregando(false);
  }

  async function criarMeta() {
    if (!nome || !valorAlvo) {
      setErro("Preencha todos os campos");
      return;
    }
    setErro("");
    setSalvando(true);

    const resultado = await criarMetaApi({ nome, valor_alvo: parseFloat(valorAlvo) });

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      setNome("");
      setValorAlvo("");
      await carregar();
    }
    setSalvando(false);
  }

  async function depositar(metaId) {
    if (!valorDeposito || parseFloat(valorDeposito) <= 0) return;

    const resultado = await depositarMetaApi(metaId, parseFloat(valorDeposito));

    if (!resultado.erro) {
      setDepositando(null);
      setValorDeposito("");
      await carregar();
    }
  }

  async function excluir(metaId) {
    if (!window.confirm("Excluir esta meta?")) return;
    await excluirMetaApi(metaId);
    await carregar();
  }

  function corProgresso(percentual) {
    if (percentual >= 100) return "linear-gradient(90deg, var(--verde), #0ea472)";
    if (percentual >= 60)  return "linear-gradient(90deg, var(--primario-claro), var(--primario))";
    if (percentual >= 30)  return "linear-gradient(90deg, var(--amarelo), #d97706)";
    return "linear-gradient(90deg, var(--vermelho), #c0392b)";
  }

  return (
    <div>
      <h1 className="pagina-titulo">Metas Financeiras</h1>

      <div className="form-card">
        <div className="form-titulo">Nova meta</div>
        {erro && <div className="erro-msg">{erro}</div>}
        <div className="form-linha">
          <div className="campo">
            <label>Nome da meta</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Viagem, Reserva de emergência"
            />
          </div>
          <div className="campo">
            <label>Valor alvo (R$)</label>
            <input
              type="number"
              value={valorAlvo}
              onChange={(e) => setValorAlvo(e.target.value)}
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>
          <button className="btn-form" onClick={criarMeta} disabled={salvando}>
            {salvando ? "Salvando..." : "+ Adicionar"}
          </button>
        </div>
      </div>

      {carregando ? (
        <p className="carregando">Carregando...</p>
      ) : metas.length === 0 ? (
        <div className="lista-vazia">Nenhuma meta cadastrada ainda</div>
      ) : (
        <div className="grade-cards">
          {metas.map((meta) => (
            <div className="card" key={meta.id}>
              <div className="card-header">
                <span className="card-titulo">{meta.nome}</span>
                <span
                  className="badge"
                  style={{
                    background: meta.percentual >= 100 ? "var(--verde-bg)" : "var(--primario-bg)",
                    color: meta.percentual >= 100 ? "var(--verde)" : "var(--primario-claro)",
                    border: meta.percentual >= 100
                      ? "1px solid rgba(34,211,165,.2)"
                      : "1px solid rgba(124,111,247,.2)",
                  }}
                >
                  {meta.percentual >= 100 ? "✓ Concluída" : `${meta.percentual}%`}
                </span>
              </div>

              <div className="card-valor">
                R$ {meta.valor_atual.toFixed(2)}
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--texto-muted)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {" "}/ R$ {meta.valor_alvo.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  height: 5,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 999,
                  margin: "14px 0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(meta.percentual, 100)}%`,
                    background: corProgresso(meta.percentual),
                    borderRadius: 999,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>

              {depositando === meta.id ? (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="number"
                    value={valorDeposito}
                    onChange={(e) => setValorDeposito(e.target.value)}
                    placeholder="Valor"
                    min="0"
                    step="0.01"
                    style={{
                      flex: 1,
                      background: "var(--fundo)",
                      border: "1px solid var(--borda)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      color: "var(--texto)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                  <button
                    className="btn-sm verde"
                    onClick={() => depositar(meta.id)}
                    style={{ flex: "none", padding: "8px 14px" }}
                  >
                    ✓
                  </button>
                  <button
                    className="btn-sm"
                    onClick={() => { setDepositando(null); setValorDeposito(""); }}
                    style={{ flex: "none", padding: "8px 14px" }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="card-acoes">
                  {meta.percentual < 100 && (
                    <button
                      className="btn-sm verde"
                      onClick={() => { setDepositando(meta.id); setValorDeposito(""); }}
                    >
                      + Depositar
                    </button>
                  )}
                  <button
                    className="btn-sm vermelho"
                    onClick={() => excluir(meta.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
