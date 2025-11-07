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
    SELECT u.id, u.name, u.email, u.document, r.name AS rol
    FROM users AS u
    LEFT JOIN user_roles AS ur ON u.id = ur.user_id
    LEFT JOIN roles AS r ON ur.rol_id = r.id
    WHERE u.email = $1 AND u.password = $2
  `;

  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ success: false, message: "Error del servidor cargando" + err });
    }

    if (results.rowCount === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
    const token = jwt.sign(
      {
        id: results.rows[0].id,
        name: results.rows[0].name,
        email: results.rows[0].email,
        roles: results.rows.map((r) => r.rol).filter(Boolean),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    const usuario = {
      id: results.rows[0].id,
      name: results.rows[0].name,
      email: results.rows[0].email,
      document: results.rows[0].document,
      roles: results.rows.map((r) => r.rol).filter(Boolean),
      token: token,
    };

    res.json({ success: true, usuario });
  });
});


app.post("/users/register", async (req, res) => {
  const { name, email, document, password } = req.body;
  if (!name || !email || !document || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos para registrar" });
  }
  try {
    const insertQuery = `
      INSERT INTO users (name, email, document, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, document 
    `;

    const values = [name, email, document, password];
    const result = await pool.query(insertQuery, values);
    const nuevoUsuario = result.rows[0];

    res.status(201).json({ success: true, usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.get("/users", verifyToken, async (req, res) => {
  try {
    const selectQuery = `
      SELECT u.id, u.name, u.email, u.document, ARRAY_AGG(r.name) AS roles
      FROM users AS u
      LEFT JOIN user_roles AS ur ON u.id = ur.user_id
      LEFT JOIN roles AS r ON ur.rol_id = r.id
      GROUP BY u.id
    `;
    const result = await pool.query(selectQuery);
    res.status(200).json({ success: true, usuarios: result.rows });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.get("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.user;
  try {
    const selectQuery = `
      SELECT id, name, email, document
      FROM users
      WHERE id = $1
    `;
    const values = [id];
    const result = await pool.query(selectQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    const usuario = result.rows[0];
    res.status(200).json({ success: true, usuario });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.put("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { name, email, document } = req.body;

  if (!name || !email || !document) {
    return res.status(400).json({ success: false, message: "Faltan datos para actualizar" });
  }

  try {
    const updateQuery = `
      UPDATE users
      SET name = $1, email = $2, document = $3
      WHERE id = $4
      RETURNING id, name, email, document
    `;

    const values = [name, email, document, id];
    const result = await pool.query(updateQuery, values);
    const usuarioActualizado = result.rows[0];

    res.status(200).json({ success: true, usuario: usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.put("/users/password/:id", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: "Falta la nueva password" });
  }
  try {
    const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING id, name, email, document
    `;
    const values = [password, id];
    const result = await pool.query(updateQuery, values);
    const usuarioActualizado = result.rows[0];

    res.status(200).json({ success: true, usuario: usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar password:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.post("/users/admin/role/:id", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { rol } = req.body;

  console.log("Asignando rol:", rol, "al usuario ID:", id);
  if (!rol) {
    return res.status(400).json({ success: false, message: "Falta el rol a asignar" });
  }
  try {
    const roleQuery = `SELECT id FROM rol WHERE id = $1`;
    const roleResult = await pool.query(roleQuery, [rol]);
    if (roleResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Rol no encontrado" });
    }
    const rolId = roleResult.rows[0].id;
    const insertQuery = `
      INSERT INTO user_roles (user_id, rol_id)
      VALUES ($1, $2) ON CONFLICT DO NOTHING
    `;
    await pool.query(insertQuery, [id, rolId]);
    res.status(200).json({ success: true, message: `Rol ${rol} asignado al usuario` });
  } catch (error) {
    console.error("Error al asignar rol:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.delete("/users/admin/role/:id", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { rol } = req.body;
  if (!rol) {
    return res.status(400).json({ success: false, message: "Falta el rol a remover" });
  }
  try {
    const deleteQuery = `
      DELETE FROM user_roles
      WHERE user_id = $1 AND rol_id = $2
    `;
    await pool.query(deleteQuery, [id, rol]);
    res.status(200).json({ success: true, message: `Rol ${rol} removido del usuario` });
  } catch (error) {
    console.error("Error al remover rol:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
