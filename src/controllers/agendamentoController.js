import { prisma } from "../lib/prisma.js";

const STATUS_VALIDOS = ["AGENDADO", "CONCLUIDO", "CANCELADO"];

function lerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listar(req, res) {
  // USER vê só os seus; ADMIN vê todos
  const where = req.usuario.role === "ADMIN" ? {} : { usuarioId: req.usuario.id };
  const agendamentos = await prisma.agendamento.findMany({
    where,
    orderBy: { data: "asc" },
  });
  res.json(agendamentos);
}

export async function criar(req, res) {
  const { nomePet, especie, servico, data } = req.body;

  if (!nomePet || !especie || !servico || !data) {
    return res.status(400).json({ erro: "nomePet, especie, servico e data são obrigatórios" });
  }
  const dataAgendada = new Date(data);
  if (Number.isNaN(dataAgendada.getTime())) {
    return res.status(400).json({ erro: "data inválida (use formato ISO, ex.: 2026-11-10T14:00:00.000Z)" });
  }

  const agendamento = await prisma.agendamento.create({
    data: {
      nomePet,
      especie,
      servico,
      data: dataAgendada,
      usuarioId: req.usuario.id, // dono vem do TOKEN, nunca do body
    },
  });
  res.status(201).json(agendamento);
}

// Busca o agendamento e aplica a regra do dono. Retorna null se já respondeu.
async function buscarComPermissao(req, res) {
  const id = lerId(req);
  if (!id) {
    res.status(400).json({ erro: "id inválido" });
    return null;
  }

  const agendamento = await prisma.agendamento.findUnique({ where: { id } });
  if (!agendamento) {                                   // 404 antes de 403
    res.status(404).json({ erro: "agendamento não encontrado" });
    return null;
  }

  const ehDono = agendamento.usuarioId === req.usuario.id;
  const ehAdmin = req.usuario.role === "ADMIN";
  if (!ehDono && !ehAdmin) {                            // regra do dono
    res.status(403).json({ erro: "você só pode alterar os seus agendamentos" });
    return null;
  }
  return agendamento;
}

export async function atualizar(req, res) {
  const agendamento = await buscarComPermissao(req, res);
  if (!agendamento) return;

  const { nomePet, especie, servico, data, status } = req.body;
  const dados = {};

  if (nomePet !== undefined) dados.nomePet = nomePet;
  if (especie !== undefined) dados.especie = especie;
  if (servico !== undefined) dados.servico = servico;
  if (data !== undefined) {
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ erro: "data inválida" });
    }
    dados.data = d;
  }
  if (status !== undefined) {
    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ erro: `status deve ser um de: ${STATUS_VALIDOS.join(", ")}` });
    }
    dados.status = status;
  }
  // usuarioId nunca é lido do body: não dá para passar o agendamento para outra pessoa

  const atualizado = await prisma.agendamento.update({
    where: { id: agendamento.id },
    data: dados,
  });
  res.json(atualizado);
}

export async function remover(req, res) {
  const agendamento = await buscarComPermissao(req, res);
  if (!agendamento) return;

  await prisma.agendamento.delete({ where: { id: agendamento.id } });
  res.json({ mensagem: "agendamento removido" });
}
