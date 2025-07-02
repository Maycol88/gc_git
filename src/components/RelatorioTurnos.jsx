import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { API_ENDPOINTS, API_HEADERS } from '@app/api';


export default function RelatorioTurnos() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    axios.get(API_ENDPOINTS.relatorioTurnos)
      .then(res => setDados(res.data))
      .catch(err => console.error("Erro ao carregar relatório:", err));
  }, []);

  return (
    <div>
      <h2>Relatório de Turnos</h2>
      <pre>{JSON.stringify(dados, null, 2)}</pre>
    </div>
  );
}
// Styled components para estilização