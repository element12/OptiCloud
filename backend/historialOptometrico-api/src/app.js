import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { verifyToken } from "./middleware/authMiddleware.js";


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
const SERVICE = process.env.SERVICE_NAME || "historial_optometrico_api";

// pendiente: realizar llamado de usuario para poner optometrista

app.get("/health", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de historial optométrico funcionando correctamente",
    service: process.env.SERVICE_NAME || "historial_optometrico_api",
    timestamp: new Date().toISOString(),
  });
});


app.get("/optometrico/v1/exams", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT 
        e.*,
        p.name AS patient_name,
        p.document AS patient_document
      FROM exams e
      INNER JOIN patients p ON e.patient_id = p.id
      ORDER BY e.id DESC
    `);

    res.json(r.rows);
  } catch (e) {
    console.error("❌ ERROR GET:", e);
    res.status(500).json({ error: "fetch failed", detail: e.detail || e.message });
  }
});

app.get("/optometrico/v1/exams/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const r = await pool.query(`
      SELECT 
        e.*,
        p.name AS patient_name,
        p.document AS patient_document
      FROM exams e
      INNER JOIN patients p ON e.patient_id = p.id
      WHERE e.id = $1
    `, [id]);

    if (r.rowCount === 0)
      return res.status(404).json({ error: "exam not found" });

    res.json(r.rows[0]);
  } catch (e) {
    console.error("❌ ERROR GET BY ID:", e);
    res.status(500).json({ error: "fetch by id failed", detail: e.detail || e.message });
  }
});

app.post("/optometrico/v1/exams", async (req, res) => {
  const {
    patient_id,
    od_sphere, od_cylinder, od_axis,
    oi_sphere, oi_cylinder, oi_axis,
    observations
  } = req.body ?? {};

  if (!patient_id)
    return res.status(400).json({ error: "patient_id es requerido" });

  try {
    const r = await pool.query(
      `INSERT INTO exams (
        patient_id, od_sphere, od_cylinder, od_axis,
        oi_sphere, oi_cylinder, oi_axis, observations
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        patient_id,
        od_sphere, od_cylinder, od_axis,
        oi_sphere, oi_cylinder, oi_axis,
        observations
      ]
    );

    res.status(201).json(r.rows[0]);
  } catch (e) {
  console.error("❌ ERROR INSERT:", e); // <--- agrega esto
  res.status(500).json({ error: "insert failed", detail: e.detail || e.message });
}
});

// ✅ PUT - Actualizar un examen por ID
app.put("/optometrico/v1/exams/:id", async (req, res) => {
  const { id } = req.params;
  const {
    patient_id,
    od_sphere, od_cylinder, od_axis,
    oi_sphere, oi_cylinder, oi_axis,
    observations
  } = req.body ?? {};

  try {
    const r = await pool.query(
      `UPDATE exams SET
        patient_id = COALESCE($1, patient_id),
        od_sphere = COALESCE($2, od_sphere),
        od_cylinder = COALESCE($3, od_cylinder),
        od_axis = COALESCE($4, od_axis),
        oi_sphere = COALESCE($5, oi_sphere),
        oi_cylinder = COALESCE($6, oi_cylinder),
        oi_axis = COALESCE($7, oi_axis),
        observations = COALESCE($8, observations)
      WHERE id = $9
      RETURNING *`,
      [
        patient_id,
        od_sphere, od_cylinder, od_axis,
        oi_sphere, oi_cylinder, oi_axis,
        observations,
        id
      ]
    );

    if (r.rowCount === 0)
      return res.status(404).json({ error: "exam not found" });

    res.json(r.rows[0]);
  } catch (e) {
    console.error("❌ ERROR UPDATE:", e);
    res.status(500).json({ error: "update failed", detail: e.detail || e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`);
});