// src/pages/RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/RegisterForm";


export default function RegisterPage() {
  return (
    
      <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem", background: "#fff", borderRadius: "8px" }}>
        <h2>Cadastro de Usuário</h2>
        <RegisterForm />
      </div>
    
  );
}
