// src/pages/BemVindoGerencia.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UnidadeForm from "../components/UnidadeForm";
import VincularUser from "../components/VincularUser";
import Escala from "./Escala";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";
import CargaHoraria from "./CargaHoraria";
import { motion } from "framer-motion";


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
          Alguns acessos abaixo são somente para listagem e outros permitem cadastros. Nenhuma ação de exclusão é permitida.
          Use os botões abaixo para navegar e entender quais funções você pode executar em cada área.
        </p>
      </div>
       
      {/* Botão Voltar aparece só se view estiver selecionada */}
      {view && (
        <button
          style={{ marginBottom: "1rem" }}
          onClick={() => setView("") /* ou, se quiser navegar para outra rota: navigate("/page-gerencia") */}
        >
          ← Voltar
        </button>
      )}

      {!view && (
        <nav style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
           <button onClick={() => navigate("/gerencia")}>← Voltar Principal</button> 
          <button onClick={() => setView("unidade")}>Cadastrar Unidades</button>
          <button onClick={() => setView("vinculo")}>Vincular Colaboradores</button>
          <button onClick={() => setView("escala")}>Planilha de Escala</button>
          <button onClick={() => setView("cargahoraria")}>Carga Horária</button>
        </nav>
      )}

      {view === "unidade" && <UnidadeForm />}
      {view === "vinculo" && <VincularUser />}
      {view === "escala" && <Escala />}
      {view === "cargahoraria" && <CargaHoraria />} {/* ← Aqui renderiza dinamicamente */}
    </div>
  );
}
