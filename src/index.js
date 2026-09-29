import "dotenv/config";
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import agendamentoRoutes from "./routes/agendamentoRoutes.js";
import userRoutes from "./routes/userRoutes.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET não definido no .env");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", tema: "Pet shop API" });
});

app.use("/auth", authRoutes);
app.use("/agendamentos", agendamentoRoutes);
app.use("/users", userRoutes);

// rota inexistente
app.use((req, res) => {
  res.status(404).json({ erro: "rota não encontrada" });
});

// erros inesperados (ex.: JSON malformado); o Express 5 também captura erros de handlers async
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error(err);
  res.status(500).json({ erro: "erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
