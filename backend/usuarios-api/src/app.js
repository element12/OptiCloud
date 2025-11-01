import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/db/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  // Consulta usuario con sus roles
  const query = `
    SELECT u.id, u.nombre, u.correo, u.documento, r.nombre AS rol
    FROM usuarios u
    LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
    LEFT JOIN rol r ON ur.rol_id = r.id
    WHERE u.correo = ? AND u.contraseña = ?
  `;

  db.query(query, [correo, contraseña], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ success: false, message: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Agrupar roles (puede tener varios)
    const usuario = {
      id: results[0].id,
      nombre: results[0].nombre,
      correo: results[0].correo,
      documento: results[0].documento,
      roles: results.map((r) => r.rol).filter(Boolean),
    };

    res.json({ success: true, usuario });
  });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
