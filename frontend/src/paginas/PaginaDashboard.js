import { useEffect, useState } from "react";
import { listarContasApi, listarAssinaturasApi } from "../api";

export default function PaginaDashboard() {
  const [contas, setContas] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const [resContas, resAssinaturas] = await Promise.all([
        listarContasApi(),
        listarAssinaturasApi(),
      ]);
      setContas(Array.isArray(resContas) ? resContas : []);
      setAssinaturas(Array.isArray(resAssinaturas) ? resAssinaturas : []);
      setCarregando(false);
    }
    carregar();
  }, []);

  const totalPendente = contas
    .filter((c) => !c.paga)
    .reduce((soma, c) => soma + c.valor, 0);

  const totalPago = contas
    .filter((c) => c.paga)
    .reduce((soma, c) => soma + c.valor, 0);

  const gastoMensal = assinaturas
    .filter((a) => a.ativa && a.ciclo === "mensal")
    .reduce((soma, a) => soma + a.valor, 0);

  const contasVencendo = contas.filter(
    (c) => !c.paga && c.dias_para_vencer >= 0 && c.dias_para_vencer <= 7
  ).length;

  if (carregando) return <p className="carregando">Carregando...</p>;

  return (
    <div>
      <h1 className="pagina-titulo">Dashboard</h1>

      <div className="resumo-grid">
        <div className="resumo-card">
          <div className="resumo-label">A Pagar</div>
          <div className="resumo-valor amarelo">
            R$ {totalPendente.toFixed(2)}
          </div>
        </div>

        <div className="resumo-card">
          <div className="resumo-label">Pago este mês</div>
          <div className="resumo-valor verde">
            R$ {totalPago.toFixed(2)}
          </div>
        </div>

        <div className="resumo-card">
          <div className="resumo-label">Assinaturas/mês</div>
          <div className="resumo-valor roxo">
            R$ {gastoMensal.toFixed(2)}
          </div>
        </div>

        <div className="resumo-card">
          <div className="resumo-label">Vencem em 7 dias</div>
          <div className={`resumo-valor ${contasVencendo > 0 ? "vermelho" : "verde"}`}>
            {contasVencendo} conta{contasVencendo !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <p style={{ fontFamily: "'Syne', sans-serif", marginBottom: 16, fontSize: "0.72rem", color: "var(--texto-muted)", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700 }}>
        Próximas a vencer
      </p>

      {contas.filter((c) => !c.paga).length === 0 ? (
        <div className="lista-vazia">Nenhuma conta pendente 🎉</div>
      ) : (
        <div className="grade-cards">
          {contas
            .filter((c) => !c.paga)
            .slice(0, 4)
            .map((conta) => (
              <div className="card" key={conta.id}>
                <div className="card-header">
                  <span className="card-titulo">{conta.descricao}</span>
                  <span className={`badge ${conta.dias_para_vencer < 0 ? "badge-vencido" : conta.dias_para_vencer <= 3 ? "badge-pendente" : "badge-pendente"}`}>
                    {conta.dias_para_vencer < 0
                      ? "Vencida"
                      : conta.dias_para_vencer === 0
                      ? "Hoje"
                      : `${conta.dias_para_vencer}d`}
                  </span>
                </div>
                <div className="card-valor">R$ {conta.valor.toFixed(2)}</div>
                <div className="card-info">Vence em {conta.vencimento}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
