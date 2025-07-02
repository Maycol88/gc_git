import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_HEADERS } from '@app/api';
 // Certifique-se de que o caminho está correto

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.senha_temporaria) {
      navigate("/alterar-senha");
      return;
    }

    // Redirecionamento por role
    if (userData.role === "adm") navigate("/adm");
    else if (userData.role === "gerencia") navigate("/gerencia");
    else if (userData.role === "user") navigate("/user");
    else navigate("/");
  }

  async function logout() {
    try {
      await fetch(API_ENDPOINTS.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // se usar cookies com sessão
      });
    } catch (error) {
      console.error("Erro ao comunicar logout com o backend:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
