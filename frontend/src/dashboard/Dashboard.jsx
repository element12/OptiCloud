import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { usuariosApi, catalogoInventarioApi, historialOptometricoApi, gestionPacienteApi } from "../api/ApiGlobal";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();
  const [historialOptometrico, setHistorialOptometrico] = useState([]);
  const [catalogoInventario, setCatalogoInventario] = useState([]);
  const [gestionPaciente, setGestionPaciente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const handleLogout = () => {
    // 🧹 Borrar datos del almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");

    // 🔁 Redirigir al login
    navigate("/login", { replace: true });
  };


  useEffect(() => {
    const historialOptometricoApiTest = async () => {
      try {
        const res = await historialOptometricoApi.get("/health");
        setHistorialOptometrico(res.data);
      } catch (error) {
        console.error("❌ Error al obtener historial optométrico:", error);
        // Opcional: mostrar mensaje en UI
        setHistorialOptometrico("Error al cargar el historial optométrico");
      }
    };

    const gestionPacienteApiTest = async () => {
      try {
        const res = await gestionPacienteApi.get("/health");
        setGestionPaciente(res.data);
      } catch (error) {
        console.error("❌ Error al obtener gestión paciente:", error);
      }
    };

    const catalogoInventarioApiTest = async () => {
      try {
        const res = await catalogoInventarioApi.get("/health");
        setCatalogoInventario(res.data);
      } catch (error) {
        console.error("❌ Error al obtener catálogo inventario:", error);
      }
    };

    const usuariosApiTest = async () => {
      try {
        const res = await usuariosApi.get("/health");
        setUsuarios(res.data);
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsuario(decoded);
      } catch (error) {
        console.error("Token inválido o corrupto:", error);
      }
    }

    usuariosApiTest();
    catalogoInventarioApiTest();
    gestionPacienteApiTest();
    historialOptometricoApiTest();

  }, []); // 👈 solo al montar


  return (
    
    <div className="container py-5">
      <h2>Bienvenido al Dashboard</h2>
      <h4 className="mt-4">Datos de usuario: </h4>
      <pre>{JSON.stringify(usuario, null, 2)}</pre>

      <h4 className="mt-4">Estado del API de Historial Optométrico:</h4>
      <pre>{JSON.stringify(historialOptometrico, null, 2)}</pre>
      <h4 className="mt-4">Estado del API de Catálogo Inventario:</h4>
      <pre>{JSON.stringify(catalogoInventario, null, 2)}</pre>
      <h4 className="mt-4">Estado del API de Gestión Paciente:</h4>
      <pre>{JSON.stringify(gestionPaciente, null, 2)}</pre>
      <h4 className="mt-4">Estado del API de Usuarios:</h4>
      <pre>{JSON.stringify(usuarios, null, 2)}</pre>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
