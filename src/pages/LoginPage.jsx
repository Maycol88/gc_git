import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { API_ENDPOINTS, API_HEADERS } from "../api";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const FormContainer = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 2.5rem 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: ${fadeInUp} 0.6s ease forwards;
  transition: box-shadow 0.3s ease;

  &:focus-within {
    box-shadow: 0 14px 40px rgba(66, 133, 244, 0.6);
  }
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #4285f4;
    outline: none;
    box-shadow: 0 0 10px #4285f4aa;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 0.85rem 1.5rem;
  background-color: #4285f4;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #3367d6;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #a1c2fa;
    cursor: not-allowed;
  }
`;

const SignupLink = styled(Link)`
  font-size: 0.9rem;
  color: #4285f4;
  text-decoration: none;
  margin-left: 1rem;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

function formatCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function LoginPage() {
  const { login } = useAuth();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const cpfInputRef = useRef(null);

  useEffect(() => {
    if (cpfInputRef.current) {
      cpfInputRef.current.focus();
    }
  }, []);

  const handleCpfChange = (e) => {
    const input = e.target.value;
    setCpf(formatCPF(input));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawCpf = cpf.replace(/\D/g, "");

    if (!cpfValidator.isValid(rawCpf)) {
      alert("CPF inválido");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // envia cookie da sessão
        body: JSON.stringify({ cpf: rawCpf, senha }),
      });

      if (!res.ok) throw new Error("Erro no login");

      const data = await res.json();
      if (data.usuario) {
  login(data.usuario); // agora sim pega o certo do backend
} else {
  alert("Login inválido");
}

    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "3.8rem", color: "#1e3c72" }}>GC</h1>
          <p style={{ margin: 0, color: "#444", fontSize: "0.95rem" }}>Gestão de Colaboradores</p>
        </div>

        <Input
          ref={cpfInputRef}
          placeholder="CPF"
          value={cpf}
          onChange={handleCpfChange}
          required
          autoComplete="username"
          maxLength={14}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          autoComplete="current-password"
        />
        <ButtonRow>
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>          
        </ButtonRow>
      </FormContainer>
    </PageWrapper>
  );
}
