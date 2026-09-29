import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export async function register(req, res) {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ erro: "nome, email e password são obrigatórios" });
  }
  if (password.length < 6) {
    return res.status(400).json({ erro: "a senha precisa ter no mínimo 6 caracteres" });
  }

  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  if (usuarioExistente) {
    return res.status(409).json({ erro: "e-mail já cadastrado" });
  }

  const senhaHash = await bcrypt.hash(password, 10);

  // role não vem do body: todo cadastro público nasce USER (padrão do schema)
  const usuario = await prisma.user.create({
    data: { nome, email, password: senhaHash },
    omit: { password: true },
  });

  return res.status(201).json(usuario);
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erro: "email e password são obrigatórios" });
  }

  const usuario = await prisma.user.findUnique({ where: { email } });

  const senhaCorreta = usuario
    ? await bcrypt.compare(password, usuario.password)
    : false;

  // mesma mensagem para "e-mail não existe" e "senha errada" (mensagem genérica)
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "credenciais inválidas" });
  }

  const token = jwt.sign(
    { role: usuario.role },               // payload: só o necessário (nunca a senha)
    process.env.JWT_SECRET,               // chave secreta vem do .env
    {
      subject: String(usuario.id),        // claim "sub" = id do usuário
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );

  return res.status(200).json({ token });
}

export async function me(req, res) {
  const usuario = await prisma.user.findUnique({
    where: { id: req.usuario.id },
    omit: { password: true },
  });

  if (!usuario) {
    return res.status(404).json({ erro: "usuário não encontrado" });
  }
  return res.json(usuario);
}
