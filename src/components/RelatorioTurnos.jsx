import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

export default function RelatorioTurnos() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    axios.get("/api/associar/relatorio_turnos.php")
      .then(res => setDados(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Relatório de Turnos</h2>
      <pre>{JSON.stringify(dados, null, 2)}</pre>
    </div>
  );
}
