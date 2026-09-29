import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import { listar, criar, atualizar, remover } from "../controllers/agendamentoController.js";

const router = Router();

router.use(autenticar); // todas as rotas de agendamento exigem login

router.get("/", listar);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", remover);

export default router;
