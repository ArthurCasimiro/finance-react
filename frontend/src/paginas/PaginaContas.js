import { useEffect, useState } from "react";
import {
  listarContasApi,
  criarContaApi,
  pagarContaApi,
  excluirContaApi,
} from "../api";

export default function PaginaContas() {
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    const dados = await listarContasApi();
    setContas(Array.isArray(dados) ? dados : []);
    setCarregando(false);
  }

  async function criarConta() {
    if (!descricao || !valor || !vencimento) {
      setErro("Preencha todos os campos");
      return;
    }
    setErro("");
    setSalvando(true);

    const resultado = await criarContaApi({ descricao, valor: parseFloat(valor), vencimento });

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      setDescricao("");
      setValor("");
      setVencimento("");
      await carregar();
    }
    setSalvando(false);
  }

  async function pagar(contaId) {
    await pagarContaApi(contaId);
    await carregar();
  }

  async function excluir(contaId) {
    if (!window.confirm("Excluir esta conta?")) return;
    await excluirContaApi(contaId);
    await carregar();
  }

  function badgeConta(conta) {
    if (conta.paga) return "badge-pago";
    if (conta.dias_para_vencer < 0) return "badge-vencido";
    return "badge-pendente";
  }

  function textoBadge(conta) {
    if (conta.paga) return "Pago";
    if (conta.dias_para_vencer < 0) return "Vencida";
    if (conta.dias_para_vencer === 0) return "Vence hoje";
    return `${conta.dias_para_vencer} dias`;
  }

  return (
    <div>
      <h1 className="pagina-titulo">Contas a Pagar</h1>

      <div className="form-card">
        <div className="form-titulo">Nova conta</div>
        {erro && <div className="erro-msg">{erro}</div>}
        <div className="form-linha">
          <div className="campo">
            <label>Descrição</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Aluguel"
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
            <label>Vencimento</label>
            <input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
            />
          </div>
          <button className="btn-form" onClick={criarConta} disabled={salvando}>
            {salvando ? "Salvando..." : "+ Adicionar"}
          </button>
        </div>
      </div>

      {carregando ? (
        <p className="carregando">Carregando...</p>
      ) : contas.length === 0 ? (
        <div className="lista-vazia">Nenhuma conta cadastrada ainda</div>
      ) : (
        <div className="grade-cards">
          {contas.map((conta) => (
            <div className="card" key={conta.id}>
              <div className="card-header">
                <span className="card-titulo">{conta.descricao}</span>
                <span className={`badge ${badgeConta(conta)}`}>
                  {textoBadge(conta)}
                </span>
              </div>
              <div className="card-valor">R$ {conta.valor.toFixed(2)}</div>
              <div className="card-info">Vencimento: {conta.vencimento}</div>
              <div className="card-acoes">
                {!conta.paga && (
                  <button className="btn-sm verde" onClick={() => pagar(conta.id)}>
                    ✓ Pagar
                  </button>
                )}
                <button className="btn-sm vermelho" onClick={() => excluir(conta.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
