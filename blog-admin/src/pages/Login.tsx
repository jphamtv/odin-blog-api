import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import { LoginForm } from "../../../shared/components/auth";

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/posts");
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate("/posts");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Blog Admin Login
          </h2>
        </div>
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
