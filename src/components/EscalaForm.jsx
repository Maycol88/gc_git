import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../api";

export default function EscalaForm() {
  const [users, setUsers] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    unidade_id: "",
    data: "",
    turno: "",
  });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch(API_ENDPOINTS.listarUsuarios)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Erro ao carregar usuários:", err));

    fetch(API_ENDPOINTS.listarUnidades)
      .then(res => res.json())
      .then(setUnidades)
      .catch(err => console.error("Erro ao carregar unidades:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("Salvando...");

    try {
      const res = await fetch(API_ENDPOINTS.listarEscalas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMensagem(data.message || "Turno salvo com sucesso");
    } catch (err) {
      console.error("Erro ao enviar escala:", err);
      setMensagem("Erro ao salvar escala. Verifique o console.");
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h2>Planilha de Escala</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Colaborador:
          <select name="user_id" value={form.user_id} onChange={handleChange}>
            <option value="">Selecione</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.nome}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Unidade:
          <select name="unidade_id" value={form.unidade_id} onChange={handleChange}>
            <option value="">Selecione</option>
            {unidades.map(u => (
              <option key={u.id} value={u.id}>{u.nome_unidade}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Data:
          <input type="date" name="data" value={form.data} onChange={handleChange} />
        </label>
        <br />

        <label>
          Turno:
          <select name="turno" value={form.turno} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="B1">B1 (08h)</option>
            <option value="B2">B2 (08h)</option>
            <option value="M">Manhã (06h)</option>
            <option value="T">Tarde (06h)</option>
            <option value="P">Plantão (12h)</option>
            <option value="N">Noturno (12h)</option>
          </select>
        </label>
        <br />

        <button type="submit">Salvar</button>
      </form>

      {mensagem && <p style={{ marginTop: "1rem" }}>{mensagem}</p>}
    </div>
  );
}
