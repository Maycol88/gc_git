import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { API_ENDPOINTS } from "../api"; // usa o endpoint centralizado

const Form = styled.form`
  max-width: 400px;
  margin: 6rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4285f4;
    outline: none;
    box-shadow: 0 0 6px #4285f4aa;
  }
`;

const Button = styled.button`
  padding: 0.85rem 1.5rem;
  background-color: #4285f4;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #3367d6;
  }

  &:disabled {
    background-color: #a1c2fa;
    cursor: not-allowed;
  }
`;

export default function RegisterForm() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          cpf: form.cpf,
          email: form.email,
          role: "user",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuário cadastrado com sucesso. Verifique o e-mail para a senha.");
        setForm({ nome: "", cpf: "", email: "" });
        navigate("/login");
      } else {
        alert(data.error || "Erro ao cadastrar");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="nome"
        placeholder="Nome"
        onChange={handleChange}
        value={form.nome}
        required
        autoComplete="name"
      />
      <Input
        name="cpf"
        placeholder="CPF"
        onChange={handleChange}
        value={form.cpf}
        required
        autoComplete="username"
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
        required
        autoComplete="email"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </Form>
  );
}
