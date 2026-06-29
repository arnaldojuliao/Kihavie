import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="register-page">
      <div className="max-w-md mx-auto">
        <div className="mb-8 flex flex-col py-4 items-center justify-center">
          <h1 className="text-3xl font-bold mb-2">Criar Conta</h1>
          <p className="text-slate-600">
            Crie uma nova conta para acessar a Kihavie
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;