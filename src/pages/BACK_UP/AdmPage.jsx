import { useState } from "react";
import UnidadeForm from "../components/UnidadeForm";
import VincularUser from "../components/VincularUser";
import Escala from "./Escala";
import UserMenu from "../components/UserMenu";
import CargaHoraria from "./CargaHoraria";
import RelatorioMensal from "./RelatorioMensal"; // importar o componente

export default function AdmPage() {
  const [view, setView] = useState("");

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <nav style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setView("unidade")}>Cadastrar Unidades</button>
          <button onClick={() => setView("vinculo")}>Vincular Colaboradores</button>
          <button onClick={() => setView("escala")}>Planilha de Escala</button>
          <button onClick={() => setView("cargahoraria")}>Carga Horária</button>
          <button onClick={() => setView("relatorio")}>Relatório Mensal</button> {/* Botão novo */}
        </nav>

        <UserMenu />
      </div>

      <hr style={{ margin: "1rem 0" }} />

      {view === "unidade" && <UnidadeForm />}
      {view === "vinculo" && <VincularUser />}
      {view === "escala" && <Escala />}
      {view === "cargahoraria" && <CargaHoraria />}
      {view === "relatorio" && <RelatorioMensal />} {/* Renderização condicional */}
    </div>
  );
}
