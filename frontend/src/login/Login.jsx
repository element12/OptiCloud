import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosApi } from "../api/ApiGlobal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await usuariosApi.post("/login", { email, password });
      const data = res.data;

      localStorage.setItem("token", data.usuario.token);
      localStorage.setItem("isLogged", "true");
      setMensaje("✅ Login exitoso");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error de login:", error);
      setMensaje("❌ Credenciales incorrectas");
    }

  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
      }}
    >
      <div className="card shadow-lg p-4" style={{ width: "22rem", borderRadius: "15px" }}>
        <h3 className="text-center mb-4">Iniciar sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>

        {mensaje && (
          <div className="alert alert-info text-center mt-3" role="alert">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
