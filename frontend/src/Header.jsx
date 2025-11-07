import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Para navegación interna

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 🧹 Borrar datos del almacenamiento
        localStorage.removeItem("token");
        localStorage.removeItem("isLogged");

        // 🔁 Redirigir al login
        navigate("/login", { replace: true });
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <h1>OptiCloud</h1>
            </div>
            <nav>
                <ul style={styles.navList}>
                    <li><Link to="/" style={styles.link}>Inicio</Link></li>
                    <li><Link to="/about" style={styles.link}>Catalogo</Link></li>
                    <li><Link to="/services" style={styles.link}>Pacientes</Link></li>
                    <li><Link to="/contact" style={styles.link}>Usuarios</Link></li>
                    <li><button onClick={handleLogout} style={styles.link_button}>Cerrar sesión</button></li>
                </ul>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        backgroundColor: "rgba(255, 241, 241, 0.9)",
        color: "#000000ff",
        height: "60px",
    },
    logo: {
        fontSize: "1.5rem",
    },
    navList: {
        listStyle: "none",
        display: "flex",
        gap: "15px",
        margin: 0,
        padding: 0,
    },
    link: {
        color: "#000000ff",
        textDecoration: "none",
        fontWeight: "bold",
    },

    link_button: {
        background: "none",
        border: "none",
        color: "#000000ff",
        textDecoration: "none",
        cursor: "pointer",
        fontWeight: "bold",
        padding: 0,
        fontSize: "1rem",
    }
};

export default Header;
