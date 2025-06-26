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
  const [cargaMensal, setCargaMensal] = useState(null);
  const [horasExecutadas, setHorasExecutadas] = useState(0);

  const voltarParaGerencia = () => {
    navigate("/pageGerencia");
  };

  useEffect(() => {
    async function fetchUnidades() {
      try {
        const res = await fetch("http://localhost:8000/api/ponto/listar.php?nome_unidade=1");
        if (!res.ok) throw new Error("Erro na resposta");
        const data = await res.json();
        setUnidades(data);
      } catch {
        setErro("Erro ao carregar unidades.");
      }
    }
    fetchUnidades();
  }, []);

  const buscarPontos = async () => {
    if (!user?.id) return;
    try {
      const mes = new Date().getMonth() + 1;
      const ano = new Date().getFullYear();
      const res = await fetch(`http://localhost:8000/api/ponto/listar.php?user_id=${user.id}&mes=${mes}&ano=${ano}`);
      const data = await res.json();
      setRegistros(data);
    } catch {
      setErro("Erro ao carregar registros de ponto.");
    }
  };

  useEffect(() => {
    buscarPontos();
  }, [user]);
  // Buscar carga mensal do usuário para mostrar na view
  // Buscar carga mensal do usuário para mostrar na view
    useEffect(() => {
      async function buscarCargaHoraria() {
        if (!user?.id) return;
        try {
          const res = await fetch(`http://localhost:8000/api/ponto/carga_horaria.php?user_id=${user.id}`);
          const data = await res.json();
          if (data?.carga != null) {
            setCargaMensal(Number(data.carga));
          }
        } catch {
          console.error("Erro ao buscar carga horária.");
        }
      }
      buscarCargaHoraria();
    }, [user]);
  
    // Somar horas executadas (baseado em horas_trabalhadas do backend)
    useEffect(() => {
      if (registros.length === 0) {
        setHorasExecutadas(0);
        return;
      }
      const totalHoras = registros.reduce((acc, r) => {
        return acc + (typeof r.horas_trabalhadas === "number" ? r.horas_trabalhadas : 0);
      }, 0);
      setHorasExecutadas(totalHoras);
    }, [registros]);
  


  const registrarPonto = async () => {
    setMensagem("");
    setErro("");

    if (!unidadeId) return setErro("Selecione uma unidade.");
    if (tipoJornada !== 8 && tipoJornada !== 12) return setErro("Escolha 8h ou 12h.");

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
        buscarPontos();
      } else {
        setErro(json.erro || "Erro desconhecido.");
      }
    } catch {
      setErro("Falha na comunicação com o servidor.");
    }
  };
// Conversão decimal horas -> "Xh Ym"
  const toHoursMinutesFromDecimal = (decimalHours) => {
    if (decimalHours == null || decimalHours < 0) return "-";
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return `${h}h ${m}m`;
  };
  const toMinutes = (str) => {
    if (!str) return null;
    const [h, m] = str.split(":").map(Number);
    return !isNaN(h) && !isNaN(m) ? h * 60 + m : null;
  };

  const toHoursMinutes = (minutos) => {
    if (minutos == null || minutos < 0) return "-";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  const calcularHoras = (r) => {
    const entrada = toMinutes(r.entrada);
    const entradaAlmoco = toMinutes(r.entrada_almoco);
    const saidaAlmoco = toMinutes(r.saida_almoco);
    const saida = toMinutes(r.saida);

    if (entrada == null || saida == null) return null;

    const overnight = saida < entrada;
    const ajustadaSaida = overnight ? saida + 1440 : saida;

    if (entradaAlmoco != null && saidaAlmoco != null) {
      return (entradaAlmoco - entrada) + (ajustadaSaida - saidaAlmoco);
    }
    return ajustadaSaida - entrada;
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial", position: "relative" }}>
      <header style={{ textAlign: "center", position: "relative" }}>
        <h2>Registro de Ponto</h2>
       <div style={{ display: "flex", justifyContent: "flex-start" }}>
  <button
    onClick={voltarParaGerencia}
    style={{
      marginTop: "10px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    }}
  >
    ← Voltar para Gerência
  </button>
</div>

        <div style={{ position: "absolute", right: 0, top: 0 }}>
                  <UserMenu />
                </div>
      </header>

      <section style={{ maxWidth: "300px", margin: "auto", marginTop: "20px" }}>
        <p><strong>Usuário:</strong> {user?.nome}</p>

        {/* Painel de horas executadas */}
        <div style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#f9f9f9"
        }}>
          <p><strong>Carga horária do mês:</strong> {cargaMensal != null ? `${cargaMensal}h` : "-"}</p>
          <p><strong>Horas executadas:</strong> {toHoursMinutesFromDecimal(horasExecutadas)}</p>
          <p><strong>Horas a cumprir:</strong> {
            cargaMensal != null
              ? toHoursMinutesFromDecimal(Math.max(cargaMensal - horasExecutadas, 0))
              : "-"
          }</p>
        </div>

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
          {[8, 12].map((h) => (
            <label key={h}>
              <input
                type="radio"
                name="tipoJornada"
                value={h}
                checked={tipoJornada === h}
                onChange={() => setTipoJornada(h)}
              />
              Jornada de {h} horas
            </label>
          ))}
        </div>

        <button onClick={registrarPonto} style={{ width: "100%", marginTop: "10px" }}>
          Registrar Ponto
        </button>

        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section style={{ maxWidth: "100%", padding: "0 1rem" }}>
        <h3>Registros do Mês Atual</h3>
        {registros.length === 0 ? (
          <p>Nenhum registro encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Entrada Almoço</th>
                <th>Saída Almoço</th>
                <th>Saída</th>
                <th>Unidade</th>
                <th>Jornada</th>
                <th>Horas Executadas</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => {
                const totalMin = calcularHoras(r);
                return (
                  <tr key={r.id}>
                    <td data-label="Entrada">{r.entrada ?? "-"}</td>
                    <td data-label="Entrada Almoço">{r.entrada_almoco ?? "-"}</td>
                    <td data-label="Saída Almoço">{r.saida_almoco ?? "-"}</td>
                    <td data-label="Saída">{r.saida ?? "-"}</td>
                    <td data-label="Unidade">{r.nome_unidade ?? "-"}</td>
                    <td data-label="Jornada">{r.tipo_jornada ? `${r.tipo_jornada}h` : "-"}</td>
                    <td data-label="Horas Executadas">
                      {r.horas_trabalhadas != null
                        ? `${Math.floor(r.horas_trabalhadas)}h ${Math.round((r.horas_trabalhadas % 1) * 60)}m`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
