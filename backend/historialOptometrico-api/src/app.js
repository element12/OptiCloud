import express from "express";
import cors from "cors";
import { pool } from "./db.js";


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
const SERVICE = process.env.SERVICE_NAME || "historial_optometrico_api";

// pendiente: realizar llamado de usuario para poner optometrista

app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));

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



app.listen(PORT, () => {
  console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`);
});