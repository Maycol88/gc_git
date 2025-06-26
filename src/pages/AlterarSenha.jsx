import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext"; // ajuste o caminho conforme sua estrutura

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
`;

const Button = styled.button`
  padding: 0.85rem 1.5rem;
  background-color: #4caf50;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

export default function AlterarSenha() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth(); // pega o user e o método login

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senha || !confirmacao || senha !== confirmacao) {
      alert("Senhas não coincidem ou estão vazias");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/alterar_senha.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          nova_senha: senha,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Senha alterada com sucesso!");

        // Atualiza localmente o user no contexto e redireciona
        const userAtualizado = { ...user, senha_temporaria: false };
        login(userAtualizado); // reaproveita login() que redireciona por role
      } else {
        alert(data.error || "Erro ao alterar senha");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "1rem" }}>Criar nova senha</h2>
      <Input
        type="password"
        placeholder="Nova senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Confirme a nova senha"
        value={confirmacao}
        onChange={(e) => setConfirmacao(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </Form>
  );
}
