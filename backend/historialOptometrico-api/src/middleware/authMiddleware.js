import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Esperamos algo como: "Bearer eyJhbGciOi..."
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos los datos del usuario en el request
    next(); // pasa a la siguiente función (ruta protegida)
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}