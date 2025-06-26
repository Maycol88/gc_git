import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #003366, #005fa3)",
        color: "#fff",
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ marginBottom: "20px", fontSize: "32px" }}>Bem-vindo ao GC</h1>
        <p style={{ marginBottom: "30px", fontSize: "18px" }}>Escolha uma opção para continuar:</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#fff",
            color: "#003366",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#fff",
            color: "#003366",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          Cadastro
        </button>
      </div>
    </div>
  );
}

export default HomePage;
