import { useState } from "react";
import "./index.css";

import PaginaAuth from "./paginas/PaginaAuth";
import PaginaDashboard from "./paginas/PaginaDashboard";
import PaginaContas from "./paginas/PaginaContas";
import PaginaAssinaturas from "./paginas/PaginaAssinaturas";
import PaginaMetas from "./paginas/PaginaMetas";
import Sidebar from "./componentes/Sidebar";

function pegarUsuarioSalvo() {
  try {
    const dados = localStorage.getItem("fintrack_usuario");
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [usuario, setUsuario] = useState(pegarUsuarioSalvo);
  const [paginaAtual, setPaginaAtual] = useState("dashboard");

  function aoLogar(dadosUsuario) {
    setUsuario(dadosUsuario);
    setPaginaAtual("dashboard");
  }

  function aoSair() {
    localStorage.removeItem("fintrack_token");
    localStorage.removeItem("fintrack_usuario");
    setUsuario(null);
  }

  if (!usuario) {
    return <PaginaAuth aoLogar={aoLogar} />;
  }

  function renderizarPagina() {
    if (paginaAtual === "dashboard") return <PaginaDashboard />;
    if (paginaAtual === "contas") return <PaginaContas />;
    if (paginaAtual === "assinaturas") return <PaginaAssinaturas />;
    if (paginaAtual === "metas") return <PaginaMetas />;
    return <PaginaDashboard />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        paginaAtual={paginaAtual}
        aoNavegar={setPaginaAtual}
        usuario={usuario}
        aoSair={aoSair}
      />
      <main className="conteudo-principal">
        {renderizarPagina()}
      </main>
    </div>
  );
}
