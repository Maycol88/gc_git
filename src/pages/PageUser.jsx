import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Modal bloqueante
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

export default function RegistroPonto() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState("");

  const [unidades, setUnidades] = useState([]);
  const [unidadeId, setUnidadeId] = useState("");
  const [tipoJornada, setTipoJornada] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [registros, setRegistros] = useState([]);
  const [cargaMensal, setCargaMensal] = useState(null);
  const [horasExecutadas, setHorasExecutadas] = useState(0);

  // Modal obrigatório se senha for temporária
  useEffect(() => {
    if (user?.senha_temporaria) {
      setShowModal(true);
    }
  }, [user]);

  const trocarSenha = async () => {
    setErroSenha("");
    setSucessoSenha("");

    if (novaSenha.length < 6) {
      setErroSenha("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/alterar_senha.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, nova_senha: novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao trocar a senha");

      // Atualiza usuário no contexto (remove senha_temporaria)
      const usuarioAtualizado = { ...user, senha_temporaria: false };
      login(usuarioAtualizado);
      setSucessoSenha("Senha alterada com sucesso!");
      setShowModal(false);
    } catch (err) {
      setErroSenha(err.message || "Erro inesperado.");
    }
  };

  // Buscar unidades ao carregar
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

  // Buscar registros do usuário
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

  // Buscar carga mensal
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

  // Somar horas
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

  // Registrar ponto
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
        <h2 style={{ margin: 0 }}>Registro de Ponto</h2>
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <UserMenu />
        </div>
      </header>

      {showModal && (
        <ModalBackdrop>
          <ModalContainer>
            <h3>Troque sua senha temporária</h3>
            <p>Por segurança, defina uma nova senha para continuar usando o sistema.</p>
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{ padding: "0.8rem", width: "100%", marginBottom: "1rem" }}
            />
            {erroSenha && <p style={{ color: "red" }}>{erroSenha}</p>}
            {sucessoSenha && <p style={{ color: "green" }}>{sucessoSenha}</p>}
            <button
              onClick={trocarSenha}
              style={{
                padding: "0.8rem 1.5rem",
                backgroundColor: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Trocar Senha
            </button>
          </ModalContainer>
        </ModalBackdrop>
      )}

      <section style={{ maxWidth: "300px", margin: "auto", marginTop: "20px" }}>
        <p><strong>Usuário:</strong> {user?.nome}</p>

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

        <button onClick={registrarPonto}>Registrar Ponto</button>

        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </section>

      <hr style={{ margin: "20px 0" }} />
      <section style={{ maxWidth: "100%", padding: "0 1rem" }}>
        <h3>Registros do Mês Atual</h3>
        {registros.length === 0 ? (
          <p>Nenhum registro encontrado.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              {registros.map((r) => (
                <tr key={r.id}>
                  <td>{r.entrada ?? "-"}</td>
                  <td>{r.entrada_almoco ?? "-"}</td>
                  <td>{r.saida_almoco ?? "-"}</td>
                  <td>{r.saida ?? "-"}</td>
                  <td>{r.nome_unidade ?? "-"}</td>
                  <td>{r.tipo_jornada ? `${r.tipo_jornada}h` : "-"}</td>
                  <td>
                    {r.horas_trabalhadas != null
                      ? `${Math.floor(r.horas_trabalhadas)}h ${Math.round((r.horas_trabalhadas % 1) * 60)}m`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
