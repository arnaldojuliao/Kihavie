import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="login-page">
      <div className="max-w-md mx-auto">
        <div className="mb-8 flex flex-col py-4 items-center justify-center">
          <h1 className="text-3xl font-bold mb-2">Entrar</h1>
          <p className="text-slate-600">
            Faça login para acessar sua conta e as suas compras
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;