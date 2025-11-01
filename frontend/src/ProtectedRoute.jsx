import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLogged = localStorage.getItem("isLogged");

  // Si NO está logueado, redirige al login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Si sí está logueado, muestra el componente hijo
  return children;
}

export default ProtectedRoute;
