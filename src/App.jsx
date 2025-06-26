import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdmPage from "./pages/AdmPage";
import PageGerencia from "./pages/PageGerencia";
import PageUser from "./pages/PageUser";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RegistroPonto from "./pages/RegistroPonto";
import BemVindoGerencia from "./pages/BemVindoGerencia";
import CargaHoraria from "./pages/CargaHoraria";
import RelatorioMensal from "./pages/RelatorioMensal";
import RegistroPontoAdmin from "./pages/RegistroPontoAdmin";
import AlterarSenha from "./pages/AlterarSenha"; // Importa a página AlterarSenha

function ProtectedRoute({ user, roles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function SenhaTemporariaRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!user.senha_temporaria) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        Carregando...
      </div>
    );

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />}
      />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/adm"
        element={
          <ProtectedRoute user={user} roles={["adm"]}>
            <AdmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gerencia"
        element={
          <ProtectedRoute user={user} roles={["gerencia"]}>
            <PageGerencia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute user={user} roles={["user"]}>
            <PageUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/carga-horaria"
        element={
          <ProtectedRoute user={user} roles={["adm", "gerencia"]}>
            <CargaHoraria />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registro-ponto"
        element={
          <ProtectedRoute user={user} roles={["user", "gerencia"]}>
            <RegistroPonto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registro-ponto-admin"
        element={
          <ProtectedRoute user={user} roles={["admin", "gerencia"]}>
            <RegistroPontoAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gerencia/bem-vindo"
        element={
          <ProtectedRoute user={user} roles={["gerencia"]}>
            <BemVindoGerencia />
          </ProtectedRoute>
        }
      />

      {/* Nova rota protegida para alterar senha */}
      <Route
        path="/alterar-senha"
        element={
          <SenhaTemporariaRoute user={user}>
            <AlterarSenha />
          </SenhaTemporariaRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Exporta o App com o AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
