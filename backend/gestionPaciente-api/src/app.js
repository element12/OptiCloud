import express from "express"; // si usas módulos ES (type: module)
import { verifyToken } from "./middleware/authMiddleware.js";
import cors from "cors";

const app = express();

app.use(cors());
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


app.get("/api/protegida", verifyToken, (req, res) => {
  const usuario = req.user; 
  //res.send("Esta es una ruta protegida" + JSON.stringify(usuario.roles) );
  if (usuario.roles.includes("Administrador")) {
    res.send("Acceso concedido a ruta de administrador.");
  } else {
    res.status(403).send("Acceso denegado. No eres administrador.");
  }
});

app.listen(3004, () => console.log("Servidor escuchando en http://localhost:3004"));
