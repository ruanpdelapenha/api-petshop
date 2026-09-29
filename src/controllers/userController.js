import { prisma } from "../lib/prisma.js";

const ROLES_VALIDOS = ["USER", "ADMIN"];

export async function listarUsuarios(req, res) {
  const usuarios = await prisma.user.findMany({ omit: { password: true } });
  res.json(usuarios);
}

export async function alterarRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "id inválido" });
  }
  if (!ROLES_VALIDOS.includes(role)) {
    return res.status(400).json({ erro: `role deve ser um de: ${ROLES_VALIDOS.join(", ")}` });
  }

  const existente = await prisma.user.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ erro: "usuário não encontrado" });
  }

  const usuario = await prisma.user.update({
    where: { id },
    data: { role },
    omit: { password: true },
  });
  res.json(usuario);
}
