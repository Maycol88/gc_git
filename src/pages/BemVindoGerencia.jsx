// src/pages/BemVindoGerencia.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UnidadeForm from "../components/UnidadeForm";
import VincularUser from "../components/VincularUser";
import Escala from "./Escala";
import CargaHoraria from "./CargaHoraria";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";
import RelatorioMensal from "./RelatorioMensal";
import RegistroPontoAdmin from "./RegistroPontoAdmin";

export default function BemVindoGerencia() {
  const { user } = useAuth();
  const [view, setView] = useState("");
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Gerência</h2>
        <UserMenu />
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h3>Seus acessos, gerente {user?.nome}</h3>
        <p>
          Alguns acessos abaixo são somente para listagem e outros permitem cadastros.
          Nenhuma ação de exclusão é permitida.
          Use os botões abaixo para navegar e entender quais funções você pode executar em cada área.
        </p>
      </div>

      {view && (
        <button
          style={{ marginBottom: "1rem" }}
          onClick={() => setView("")}
        >
          ← Voltar
        </button>
      )}

      {!view && (
        <nav style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/gerencia")}>← Voltar para Gerência</button>
          <button onClick={() => setView("unidade")}>Cadastrar Unidades</button>
          <button onClick={() => setView("vinculo")}>Vincular Colaboradores</button>
          <button onClick={() => setView("escala")}>Planilha de Escala</button>
          <button onClick={() => setView("cargahoraria")}>Carga Horária</button>
          <button onClick={() => setView("relatorio")}>Relatório Mensal</button>
          <button onClick={() => setView("registroAdmin")}>Registro de Ponto Manual</button>
          
        </nav>
      )}

      {view === "unidade" && <UnidadeForm />}
      {view === "vinculo" && <VincularUser />}
      {view === "escala" && <Escala />}
      {view === "cargahoraria" && <CargaHoraria />}
      {view === "relatorio" && <RelatorioMensal />}
      {view === "registroAdmin" && <RegistroPontoAdmin />}
    </div>
  );
}
