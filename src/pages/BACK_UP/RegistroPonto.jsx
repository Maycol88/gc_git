import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";

export default function RegistroPonto() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [unidades, setUnidades] = useState([]);
  const [unidadeId, setUnidadeId] = useState("");
  const [tipoJornada, setTipoJornada] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [registros, setRegistros] = useState([]);

  // Função para voltar para a PageGerencia
  const handleVoltar = () => {
    navigate("/gerencia");
  };

  // Função para buscar as unidades
  useEffect(() => {
    fetch("http://localhost:8000/api/ponto/listar.php?nome_unidade=1")
      .then((res) => {
        if (!res.ok) throw new Error("Erro na resposta");
        return res.json();
      })
      .then((data) => setUnidades(data))
      .catch(() => setErro("Erro ao carregar unidades."));
  }, []);

  // Função para buscar os registros do usuário no mês atual
  const buscarPontos = async () => {
    if (!user?.id) return;
    try {
      const mes = new Date().getMonth() + 1; // mês atual
      const ano = new Date().getFullYear();

      const res = await fetch(
        `http://localhost:8000/api/ponto/listar.php?user_id=${user.id}&mes=${mes}&ano=${ano}`
      );
      const dados = await res.json();
      setRegistros(dados);
    } catch (error) {
      setErro("Erro ao carregar registros de ponto.");
    }
  };

  // Busca os registros ao carregar e após registrar ponto
  useEffect(() => {
    buscarPontos();
  }, [user]);

  // Função para registrar ponto
  const registrarPonto = async () => {
    setMensagem("");
    setErro("");

    if (!unidadeId) return setErro("Selecione uma unidade.");
    if (!tipoJornada && tipoJornada !== 0) return setErro("Escolha 8h ou 12h.");

    try {
      const res = await fetch("http://localhost:8000/api/ponto/registrar.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          unidade_id: unidadeId,
          tipo_jornada: tipoJornada,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setMensagem(json.mensagem);
        buscarPontos(); // Atualiza a lista após o registro
      } else {
        setErro(json.erro || "Erro desconhecido.");
      }
    } catch {
      setErro("Falha na comunicação com o servidor.");
    }
  };

  // Helpers para cálculo de horas
  const toMinutes = (dateTimeStr) => {
    if (!dateTimeStr) return null;

    try {
      const date = new Date(dateTimeStr.replace(" ", "T")); // garante compatibilidade
      const h = date.getHours();
      const m = date.getMinutes();
      return h * 60 + m;
    } catch {
      return null;
    }
  };

  const toHoursMinutes = (minutos) => {
    if (minutos == null || minutos < 0) return "-";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  // Função para formatar a data sem alterar pelo fuso horário
  const formatDateOnly = (dataStr) => {
    if (!dataStr) return "-";
    const [datePart] = dataStr.split(" "); // pega só a parte da data
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Registro de Ponto</h2>
        <UserMenu />
      </div>

      <button onClick={handleVoltar} style={{ marginBottom: "1rem" }}>
        ← Voltar para Gerência
      </button>

      <div style={{ maxWidth: "600px", margin: "auto", marginTop: "20px" }}>
        <p>
          <strong>Usuário:</strong> {user?.nome}
        </p>

        <label>Unidade:</label>
        <select value={unidadeId} onChange={(e) => setUnidadeId(e.target.value)}>
          <option value="">Selecione uma unidade</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome_unidade}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "20px", margin: "10px 0" }}>
          <label>
            <input
              type="radio"
              name="tipoJornada"
              value="8"
              checked={tipoJornada === 8}
              onChange={() => setTipoJornada(8)}
            />
            Jornada de 8 horas
          </label>
          <label>
            <input
              type="radio"
              name="tipoJornada"
              value="12"
              checked={tipoJornada === 12}
              onChange={() => setTipoJornada(12)}
            />
            Jornada de 12 horas
          </label>
        </div>

        <button onClick={registrarPonto}>Registrar Ponto</button>

        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {/* Relatório dos registros */}
        <hr style={{ margin: "20px 0" }} />
        <h3>Registros do Mês Atual</h3>

        {registros.length === 0 ? (
          <p>Nenhum registro encontrado.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Entrada
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Entrada Almoço
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Saída Almoço
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Saída
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Unidade
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Jornada
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Horas Executadas
                </th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => {
                

                const entradaMin = toMinutes(r.entrada);
                const entradaAlmocoMin = toMinutes(r.entrada_almoco);
                const saidaAlmocoMin = toMinutes(r.saida_almoco);
                const saidaMin = toMinutes(r.saida);

                let totalMinutos = null;

                if (entradaMin !== null && saidaMin !== null) {
                  if (saidaMin < entradaMin) {
                    // Passou da meia-noite, soma 24h na saída
                    if (entradaAlmocoMin !== null && saidaAlmocoMin !== null) {
                      totalMinutos =
                        entradaAlmocoMin - entradaMin + (saidaMin + 1440 - saidaAlmocoMin);
                    } else {
                      totalMinutos = saidaMin + 1440 - entradaMin;
                    }
                  } else {
                    // Mesmo dia, cálculo normal
                    if (entradaAlmocoMin !== null && saidaAlmocoMin !== null) {
                      totalMinutos = entradaAlmocoMin - entradaMin + (saidaMin - saidaAlmocoMin);
                    } else {
                      totalMinutos = saidaMin - entradaMin;
                    }
                  }
                }

                return (
                  <tr key={r.id}>
                    
                    <td>{r.entrada ?? "-"}</td>
                    <td>{r.entrada_almoco ?? "-"}</td>
                    <td>{r.saida_almoco ?? "-"}</td>
                    <td>{r.saida ?? "-"}</td>
                    <td>{r.nome_unidade ?? "-"}</td>
                    <td>{r.tipo_jornada ? r.tipo_jornada + "h" : "-"}</td>
                    <td>
                      {r.horas_trabalhadas != null
                        ? `${Math.floor(r.horas_trabalhadas)}h ${Math.round(
                            (r.horas_trabalhadas % 1) * 60
                          )}m`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
