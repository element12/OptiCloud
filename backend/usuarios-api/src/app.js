import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/authMiddleware.js";
import bcrypt from "bcrypt";

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos para ingresar" });
  }

  try {
    // 1️⃣ Obtener usuario y sus roles por email
    const query = `
      SELECT u.id, u.name, u.email, u.document, u.password, r.name AS rol
      FROM users AS u
      LEFT JOIN user_roles AS ur ON u.id = ur.user_id
      LEFT JOIN roles AS r ON ur.rol_id = r.id
      WHERE u.email = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const user = result.rows[0];

    // 2️⃣ Validar contraseña usando bcrypt
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // 3️⃣ Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: result.rows.map(r => r.rol).filter(Boolean),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    const usuario = {
      id: user.id,
      name: user.name,
      email: user.email,
      document: user.document,
      roles: result.rows.map(r => r.rol).filter(Boolean),
      token,
    };

    res.json({ success: true, usuario });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});


app.post("/users/register", async (req, res) => {
  const { name, email, document, password } = req.body;
  if (!name || !email || !document || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos para registrar" });
  }

  try {
    // Asegurarse de que password sea string
    const passwordString = String(password);
    
    // 1️⃣ Insertar usuario

    const saltRounds = 10; // número de rondas de sal (recomendado 10-12)
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const insertUserQuery = `
      INSERT INTO users (name, email, document, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, document
    `;

    const values = [name, email, document, hashedPassword];
    const result = await pool.query(insertUserQuery, values);
    const nuevoUsuario = result.rows[0];

    console.log("Usuario registrado:", nuevoUsuario);

    const insertRoleQuery = `
      INSERT INTO user_roles (user_id, rol_id)
      VALUES ($1, $2)
    `;
    await pool.query(insertRoleQuery, [nuevoUsuario.id, 2]);

    res.status(201).json({ success: true, usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, message: "Error del servidor: " + error.message });
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
  const id = req.params.id;
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
  const id = req.params.id;
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
  const id = req.params.id;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: "Falta la nueva password" });
  }
  try {

    const saltRounds = 10; // número de rondas de sal (recomendado 10-12)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING id, name, email, document
    `;
    const values = [hashedPassword, id];
    const result = await pool.query(updateQuery, values);
    const usuarioActualizado = result.rows[0];

    res.status(200).json({ success: true, usuario: usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar password:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.post("/users/admin/role/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { rol } = req.body;

  console.log("Asignando rol:", rol, "al usuario ID:", id);
  if (!rol) {
    return res.status(400).json({ success: false, message: "Falta el rol a asignar" });
  } 
  try {
    const roleQuery = `SELECT id FROM roles WHERE id = $1`;
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
  const id = req.params.id;
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
