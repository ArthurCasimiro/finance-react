import { useEffect, useState } from "react";
import {
  listarAssinaturasApi,
  criarAssinaturaApi,
  cancelarAssinaturaApi,
} from "../api";

const ICONES_CICLO = { mensal: "📅", anual: "📆", semanal: "🗓️" };

export default function PaginaAssinaturas() {
  const [assinaturas, setAssinaturas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [ciclo, setCiclo] = useState("mensal");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    const dados = await listarAssinaturasApi();
    setAssinaturas(Array.isArray(dados) ? dados : []);
    setCarregando(false);
  }

  async function criarAssinatura() {
    if (!nome || !valor) {
      setErro("Preencha todos os campos");
      return;
    }
    setErro("");
    setSalvando(true);

    const resultado = await criarAssinaturaApi({
      nome,
      valor: parseFloat(valor),
      ciclo,
    });

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      setNome("");
      setValor("");
      setCiclo("mensal");
      await carregar();
    }
    setSalvando(false);
  }

  async function cancelar(assinaturaId) {
    if (!window.confirm("Cancelar esta assinatura?")) return;
    await cancelarAssinaturaApi(assinaturaId);
    await carregar();
  }

  const totalMensal = assinaturas
    .filter((a) => a.ciclo === "mensal")
    .reduce((soma, a) => soma + a.valor, 0);

  return (
    <div>
      <h1 className="pagina-titulo">Assinaturas</h1>

      <div className="form-card">
        <div className="form-titulo">Nova assinatura</div>
        {erro && <div className="erro-msg">{erro}</div>}
        <div className="form-linha">
          <div className="campo">
            <label>Nome do serviço</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Netflix"
            />
          </div>
          <div className="campo">
            <label>Valor (R$)</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="campo">
            <label>Ciclo</label>
            <select value={ciclo} onChange={(e) => setCiclo(e.target.value)}>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>
          <button className="btn-form" onClick={criarAssinatura} disabled={salvando}>
            {salvando ? "Salvando..." : "+ Adicionar"}
          </button>
        </div>
      </div>

      {assinaturas.filter((a) => a.ciclo === "mensal").length > 0 && (
        <div style={{ marginBottom: 20, color: "var(--texto-muted)", fontSize: "0.85rem" }}>
          Gasto mensal com assinaturas:{" "}
          <strong style={{ color: "var(--primario-claro)" }}>
            R$ {totalMensal.toFixed(2)}
          </strong>
        </div>
      )}

      {carregando ? (
        <p className="carregando">Carregando...</p>
      ) : assinaturas.length === 0 ? (
        <div className="lista-vazia">Nenhuma assinatura cadastrada</div>
      ) : (
        <div className="grade-cards">
          {assinaturas.map((assinatura) => (
            <div className="card" key={assinatura.id}>
              <div className="card-header">
                <span className="card-titulo">{assinatura.nome}</span>
                <span style={{ fontSize: "1.2rem" }}>
                  {ICONES_CICLO[assinatura.ciclo]}
                </span>
              </div>
              <div className="card-valor">R$ {assinatura.valor.toFixed(2)}</div>
              <div className="card-info">{assinatura.ciclo}</div>
              <div className="card-acoes">
                <button
                  className="btn-sm vermelho"
                  onClick={() => cancelar(assinatura.id)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
