import express from "express"; // si usas módulos ES (type: module)
import { verifyToken } from "./middleware/authMiddleware.js";
import cors from "cors";
import { pool } from "./db.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola desde Node.js!");
});

app.get("/health", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de gestión de Pacientes funcionando correctamente",
    service: process.env.SERVICE_NAME || "gestion_paciente_api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/patients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM data_patients INNER JOIN patients ON data_patients.patient_id = patients.id ORDER BY patient_id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/v1/patients/:id - obtener uno
app.get("/api/v1/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener datos del paciente
    const patientQuery = `
      SELECT *
      FROM data_patients
      INNER JOIN patients ON data_patients.patient_id = patients.id
      WHERE patient_id = $1
    `;
    const patientResult = await pool.query(patientQuery, [id]);

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2. Consultar exámenes del paciente
    const examsQuery = `
      SELECT *
      FROM exams
      WHERE patient_id = $1
      ORDER BY date DESC
    `;
    const examsResult = await pool.query(examsQuery, [id]);

    // 3. Construir respuesta final
    const response = {
      patient: patientResult.rows[0],
      exams: examsResult.rows.length > 0 ? examsResult.rows : "No se encuentran registros de exámenes"
    };

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// POST /api/v1/patients - crear nuevo
app.post("/api/v1/patients", async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      name, 
      document, 
      age, 
      birth_date, 
      address, 
      city, 
      neighborhood, 
      gender, 
      observations 
    } = req.body;

    await client.query("BEGIN");

    const insertPatient = await client.query(
      `INSERT INTO patients (name, document)
       VALUES ($1, $2)
       RETURNING id AS patient_id, name, document`,
      [name, document]
    );
    const patientId = insertPatient.rows[0].patient_id;

    const insertData = await client.query(
      `INSERT INTO data_patients (patient_id, age, birth_date, address, city, neighborhood, gender, observations)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [patientId, age, birth_date, address, city, neighborhood, gender, observations]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Patient created successfully",
      patient: {
        ...insertPatient.rows[0],
        data: insertData.rows[0]
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});

// PUT /api/v1/patients/:id - actualizar
app.put("/api/v1/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { age, birth_date, address, city, neighborhood, gender, observations } = req.body;

    const result = await pool.query(
      `UPDATE data_patients
       SET age = $1, birth_date = $2, address = $3, city = $4,
           neighborhood = $5, gender = $6, observations = $7
       WHERE patient_id = $8
       RETURNING *`,
      [age, birth_date, address, city, neighborhood, gender, observations, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Patient not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/v1/patients/:id - eliminar
app.delete("/api/v1/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM data_patients WHERE patient_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3004, () => console.log("Servidor escuchando en http://localhost:3004"));
