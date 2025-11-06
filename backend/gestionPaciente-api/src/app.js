import express from "express"; // si usas módulos ES (type: module)
import { verifyToken } from "./middleware/authMiddleware.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Hola desde Node.js!");
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

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));
