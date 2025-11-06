import express from "express"; // si usas módulos ES (type: module)
const app = express();

app.get("/", (req, res) => {
  res.send("Holaaa desde Node.js!");
});

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));
