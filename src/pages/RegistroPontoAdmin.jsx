import React, { useState, useEffect } from "react";
import UserMenu from "../components/UserMenu";
import { API_ENDPOINTS, API_HEADERS } from '@app/api';


export default function RegistroPontoAdmin({ setView }) {
  const [usuarios, setUsuarios] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [unidadeId, setUnidadeId] = useState("");
  const [tipoJornada, setTipoJornada] = useState(null);

  const [entrada, setEntrada] = useState("");
  const [entradaAlmoco, setEntradaAlmoco] = useState("");
  const [saidaAlmoco, setSaidaAlmoco] = useState("");
  const [saida, setSaida] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch(API_ENDPOINTS.listarUsuarios);
        const data = await res.json();
        console.log("Usuários recebidos:", data); // DEBUG
        setUsuarios(data);
      } catch {
        setErro("Erro ao carregar usuários.");
      }
    }

    async function fetchUnidades() {
      try {
        const res = await fetch(`${API_ENDPOINTS.listarUnidades}?nome_unidade=1`);
        const data = await res.json();
        setUnidades(data);
      } catch {
        setErro("Erro ao carregar unidades.");
      }
    }

    fetchUsuarios();
    fetchUnidades();
  }, []);

  function formatDateTimeLocalToBackend(dtLocal) {
    if (!dtLocal) return null;
    return dtLocal.replace("T", " ") + ":00";
  }

  const registrarPonto = async () => {
    setMensagem("");
    setErro("");

    if (!selectedUserId || !unidadeId || ![8, 12].includes(tipoJornada)) {
      return setErro("Preencha todos os campos obrigatórios.");
    }

    const payload = {
      user_id: selectedUserId,
      unidade_id: unidadeId,
      tipo_jornada: tipoJornada,
      entrada: formatDateTimeLocalToBackend(entrada),
      entrada_almoco: tipoJornada === 8 ? formatDateTimeLocalToBackend(entradaAlmoco) : null,
      saida_almoco: tipoJornada === 8 ? formatDateTimeLocalToBackend(saidaAlmoco) : null,
      saida: formatDateTimeLocalToBackend(saida),
    };

    try {
      const res = await fetch(API_ENDPOINTS.registrarManual, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setMensagem(json.message || "Ponto registrado com sucesso.");
        setErro("");
        // Limpar campos
        setSelectedUserId("");
        setUnidadeId("");
        setTipoJornada(null);
        setEntrada("");
        setEntradaAlmoco("");
        setSaidaAlmoco("");
        setSaida("");
      } else {
        setErro(json.error || "Erro desconhecido.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="page-center">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "500px",
          marginBottom: "px",
        }}
      >
        <h2>Registro de Ponto Manual</h2>
      </header>

      <section style={{ width: "100%", maxWidth: "500px" }}>
        <label>Usuário:</label>
        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
          <option value="">Selecione o usuário</option>
          {usuarios
            .filter((u) => {
              const role = u?.role?.toLowerCase?.();
              return role === "user" || role === "gerencia";
            })
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
        </select>

        <label>Unidade:</label>
        <select value={unidadeId} onChange={(e) => setUnidadeId(e.target.value)}>
          <option value="">Selecione a unidade</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome_unidade}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "20px", margin: "10px 0", flexWrap: "wrap" }}>
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

        <div style={{ marginTop: "20px" }}>
          <label>Entrada:</label>
          <input type="datetime-local" value={entrada} onChange={(e) => setEntrada(e.target.value)} />

          {tipoJornada === 8 && (
            <>
              <label>Entrada Almoço:</label>
              <input
                type="datetime-local"
                value={entradaAlmoco}
                onChange={(e) => setEntradaAlmoco(e.target.value)}
              />

              <label>Saída Almoço:</label>
              <input
                type="datetime-local"
                value={saidaAlmoco}
                onChange={(e) => setSaidaAlmoco(e.target.value)}
              />
            </>
          )}

          <label>Saída:</label>
          <input type="datetime-local" value={saida} onChange={(e) => setSaida(e.target.value)} />
        </div>

        <button onClick={registrarPonto} style={{ marginTop: "15px" }}>
          Registrar Ponto
        </button>

        {mensagem && <p style={{ color: "var(--success)" }}>{mensagem}</p>}
        {erro && <p style={{ color: "var(--danger)" }}>{erro}</p>}
      </section>
    </div>
  );
}
