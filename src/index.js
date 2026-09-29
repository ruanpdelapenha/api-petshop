import "dotenv/config";
import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", tema: "Pet shop API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});