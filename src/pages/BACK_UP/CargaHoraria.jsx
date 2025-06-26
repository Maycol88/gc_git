import React, { useEffect, useState, useRef } from "react";

export default function CargaHoraria() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargas, setCargas] = useState({});
  const [mensagens, setMensagens] = useState({});
  const debounceTimers = useRef({});

 useEffect(() => {
  fetch("http://localhost:8000/api/ponto/carga_horaria.php")
    .then((res) => res.json())
    .then((data) => {
      console.log("Dados recebidos do backend:", data);
      setUsuarios(data);

      const valoresIniciais = {};
      data.forEach((u) => {
        valoresIniciais[u.id] = ""; // ← input inicia vazio
      });

      setCargas(valoresIniciais);
    })
    .catch(() => alert("Erro ao carregar usuários"));
}, []);



  const salvarCarga = async (userId, carga) => {
    setMensagens((m) => ({ ...m, [userId]: "Salvando..." }));

    try {
      const res = await fetch("http://localhost:8000/api/ponto/carga_horaria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, carga }),
      });

      const json = await res.json();
      if (res.ok) {
        setMensagens((m) => ({ ...m, [userId]: `✅ ${json.mensagem}` }));
      } else {
        setMensagens((m) => ({ ...m, [userId]: json.erro || "Erro." }));
      }
    } catch {
      setMensagens((m) => ({ ...m, [userId]: "Erro de rede." }));
    }
  };

  const handleInputChange = (userId, value) => {
    setCargas((c) => ({ ...c, [userId]: value }));

    if (debounceTimers.current[userId]) {
      clearTimeout(debounceTimers.current[userId]);
    }

    debounceTimers.current[userId] = setTimeout(() => {
      salvarCarga(userId, value);
    }, 600);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" }}>
      <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>Gerenciar Carga Horária</h3>

      <div
        style={{
          background: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        {usuarios.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              paddingBottom: "6px",
              borderBottom: "1px dashed #ccc",
            }}
          >
            {/* Nome do usuário */}
            <span style={{ flex: 1 }}>{user.nome}</span>

            {/* Mostrar a carga horária atual (texto fixo) */}
            <span
  style={{
    width: "120px",
    textAlign: "right",
    fontWeight: "bold",
    color: "#333",
    marginRight: "15px",
    userSelect: "none",
  }}
  title="Carga Horária Atual"
>
  {user.carga !== null && user.carga !== undefined ? `${user.carga} horas` : "-"}
</span>


            {/* Input para atualizar a carga */}
            <input
  type="number"
  min="0"
  step="0.01"
  placeholder="Horas"
  value={cargas[user.id] ?? ""}
  onChange={(e) => handleInputChange(user.id, e.target.value)}
  style={{
    width: "80px",
    padding: "4px 6px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  }}
/>



            {/* Mensagem de status */}
            <span
              style={{
                fontSize: "0.85em",
                color: mensagens[user.id]?.includes("✅") ? "green" : "gray",
                marginLeft: "10px",
                whiteSpace: "nowrap",
              }}
            >
              {mensagens[user.id]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
