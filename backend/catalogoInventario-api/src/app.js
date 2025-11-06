import express from "express";
import { ObjectId } from "mongodb";
import { connectDB, stockproductos } from "./config/db.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Conectar a la base de datos
await connectDB();

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
function validarProducto(datos) {
  const errores = [];

  if (!datos.nombre || datos.nombre.trim() === "") {
    errores.push("El nombre es obligatorio");
  }

  if (datos.precio === undefined || datos.precio < 0) {
    errores.push("El precio debe ser un número positivo");
  }

  if (datos.stock === undefined || datos.stock < 0) {
    errores.push("El stock debe ser un número positivo");
  }

  return errores;
}

// ==========================================
// ENDPOINTS DE LA API
// ==========================================

// POST - Crear nuevo producto
app.post("/api/v1/products", async (req, res) => {
  try {
    const datos = req.body;

    // Validar datos
    const errores = validarProducto(datos);
    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errores: errores,
      });
    }

    // Crear nuevo producto
    const nuevoProducto = {
      nombre: datos.nombre,
      descripcion: datos.descripcion || "",
      precio: parseFloat(datos.precio),
      stock: parseInt(datos.stock),
      categoria: datos.categoria || "general",
      activo: datos.activo !== undefined ? datos.activo : true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    const result = await stockproductos.insertOne(nuevoProducto);

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: {
        _id: result.insertedId,
        ...nuevoProducto,
      },
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      error: error.message,
    });
  }
});

// GET - Listar productos (con filtros opcionales)
app.get("/api/v1/products", async (req, res) => {
  try {
    const { categoria, nombre, precioMin, precioMax, activo } = req.query;

    // Construir filtro dinámico
    const filtro = {};

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (nombre) {
      filtro.nombre = { $regex: nombre, $options: "i" };
    }

    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) filtro.precio.$gte = parseFloat(precioMin);
      if (precioMax) filtro.precio.$lte = parseFloat(precioMax);
    }

    if (activo !== undefined) {
      filtro.activo = activo === "true";
    }

    // Obtener productos
    const productos = await stockproductos.find(filtro).toArray();

    res.status(200).json({
      success: true,
      total: productos.length,
      data: productos,
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message,
    });
  }
});

// PUT - Actualizar producto/inventario
app.put("/api/v1/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    // Validar ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido",
      });
    }

    // Preparar datos para actualización
    const datosActualizacion = { ...datos };
    datosActualizacion.fechaActualizacion = new Date();

    // Actualizar producto
    const result = await stockproductos.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: datosActualizacion },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: result.value,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
});

// ==========================================
// ENDPOINT DE SALUD (Health Check)
// ==========================================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Catálogo e Inventario funcionando correctamente",
    service: process.env.SERVICE_NAME || "catalogo_inventario_api",
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});
