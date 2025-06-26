import { useState } from "react";
import { RotateCcw } from "lucide-react";
import UnidadeForm from "../components/UnidadeForm";
import VincularUser from "../components/VincularUser";
import Escala from "./Escala";
import UserMenu from "../components/UserMenu";
import CargaHoraria from "./CargaHoraria";
import RelatorioMensal from "./RelatorioMensal";
import RegisterPage from "./RegisterPage";
import ListarUser from "./ListarUser";
import RegistroPontoAdmin from "./RegistroPontoAdmin";

export default function AdmPage() {
  const [view, setView] = useState("");

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "30px" }}>
          {/* Menu: Colaborador */}
          <div className="menu-group">
            <strong>Colaborador</strong>
            <div className="buttons-container">
              <button onClick={() => setView("vinculo")}>Vincular Colaboradores</button>
              <button onClick={() => setView("cargahoraria")}>Carga Horária</button>
              <button onClick={() => setView("escala")}>Planilha de Escala</button>
            </div>
          </div>

          {/* Menu: Cadastros */}
          <div className="menu-group">
            <strong>Cadastros</strong>
            <div className="buttons-container">
              <button onClick={() => setView("unidade")}>Cadastrar Unidades</button>
              <button onClick={() => setView("register")}>Cadastrar Usuários</button>
              <button onClick={() => setView("registroAdmin")}>Registro de Ponto (Admin)</button>

              
            </div>
          </div>

          {/* Menu: Listar */}
          <div className="menu-group">
            <strong>Listar</strong>
            <div className="buttons-container">
              <button onClick={() => setView("listar")}>Listar Usuários</button>
              <button onClick={() => setView("relatorio")}>Relatório Mensal</button>
            </div>
          </div>
        </div>

        {/* Botão de recarregar + menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
  onClick={() => window.location.reload()}
  title="Recarregar Página"
  style={{ padding: "0.4rem", background: "transparent" }}
>
  <RotateCcw size={30} color="#0076c0" />
</button>
          <UserMenu />
        </div>
      </div>

      <hr style={{ margin: "1rem 0" }} />

      {/* Conteúdo renderizado conforme view */}
      {view === "unidade" && <UnidadeForm />}
      {view === "vinculo" && <VincularUser />}
      {view === "escala" && <Escala />}
      {view === "cargahoraria" && <CargaHoraria />}
      {view === "relatorio" && <RelatorioMensal />}
      {view === "register" && <RegisterPage />}
      {view === "listar" && <ListarUser />}
      {view === "registroAdmin" && <RegistroPontoAdmin />}
    </div>
  );
}
