const ROTAS = [
  { chave: "dashboard", icone: "◈", label: "Dashboard" },
  { chave: "contas", icone: "📋", label: "Contas a Pagar" },
  { chave: "assinaturas", icone: "🔄", label: "Assinaturas" },
  { chave: "metas", icone: "🎯", label: "Metas" },
];

export default function Sidebar({ paginaAtual, aoNavegar, usuario, aoSair }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FinTrack</div>

      <nav className="sidebar-nav">
        {ROTAS.map((rota) => (
          <button
            key={rota.chave}
            className={`nav-item ${paginaAtual === rota.chave ? "ativo" : ""}`}
            onClick={() => aoNavegar(rota.chave)}
          >
            <span className="nav-icone">{rota.icone}</span>
            {rota.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-usuario">
        <div className="sidebar-usuario-nome">{usuario.nome}</div>
        <div className="sidebar-usuario-email">{usuario.email}</div>
        <button className="btn-sair" onClick={aoSair}>
          Sair
        </button>
      </div>
    </aside>
  );
}
