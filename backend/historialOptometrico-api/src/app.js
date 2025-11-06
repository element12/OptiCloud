import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
const SERVICE = process.env.SERVICE_NAME || "historial_optometrico_api";

app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));


app.listen(PORT, () => {
  console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`);
});