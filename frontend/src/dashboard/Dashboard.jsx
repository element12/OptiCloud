import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 Borrar datos del almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");

    // 🔁 Redirigir al login
    navigate("/login", { replace: true });
  };

  return (
    <div className="container py-5">
      <h2>Bienvenido al Dashboard 🚀</h2>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
