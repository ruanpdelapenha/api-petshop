import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { listarUsuarios, alterarRole } from "../controllers/userController.js";

const router = Router();

// a ordem importa: primeiro autenticar (401), depois autorizar (403)
router.use(autenticar, autorizar("ADMIN"));

router.get("/", listarUsuarios);
router.patch("/:id/role", alterarRole);

export default router;
