import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Usuarios funcionando correctamente",
    service: process.env.SERVICE_NAME || "usuarios_api",
    timestamp: new Date().toISOString(),
  });
});


// Health DB
app.get("/db/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos para ingresar2" });
  }

  // Consulta usuario con sus roles
  const query = `
    SELECT u.id, u.nombre, u.correo, u.documento, r.nombre AS rol
    FROM usuarios AS u
    LEFT JOIN usuarios_roles AS ur ON u.id = ur.usuario_id
    LEFT JOIN rol AS r ON ur.rol_id = r.id
    WHERE u.correo = $1 AND u.contraseña = $2
  `;

  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ success: false, message: "Error del servidor cargando" + err });
    }

    if (results.rowCount === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    //console.log(results.rows[0].id);

    //return res.status(200).json({ success: true, message: "Login exitoso" });
    // Agrupar roles (puede tener varios)

    //🪄 Generar el token JWT
    const token = jwt.sign(
      {
        id: results.rows[0].id,
        nombre: results.rows[0].nombre,
        correo: results.rows[0].correo,
        roles: results.rows.map((r) => r.rol).filter(Boolean),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );


    const usuario = {
      id: results.rows[0].id,
      nombre: results.rows[0].nombre,
      correo: results.rows[0].correo,
      documento: results.rows[0].documento,
      roles: results.rows.map((r) => r.rol).filter(Boolean),
      token: token,
    };

    res.json({ success: true, usuario });
  });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
