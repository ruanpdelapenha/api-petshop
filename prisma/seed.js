import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  await prisma.agendamento.deleteMany();
  await prisma.user.deleteMany();

  const senhaHash = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: { nome: "Administrador", email: "admin@petshop.com", password: senhaHash, role: "ADMIN" },
  });

  const maria = await prisma.user.create({
    data: { nome: "Maria Silva", email: "maria@petshop.com", password: senhaHash },
  });
  const joao = await prisma.user.create({
    data: { nome: "João Souza", email: "joao@petshop.com", password: senhaHash },
  });

  await prisma.agendamento.createMany({
    data: [
      { nomePet: "Thor", especie: "Cachorro", servico: "Banho e tosa", data: new Date("2026-11-10T14:00:00.000Z"), usuarioId: maria.id },
      { nomePet: "Mia", especie: "Gato", servico: "Consulta veterinária", data: new Date("2026-11-12T10:00:00.000Z"), usuarioId: maria.id },
      { nomePet: "Bolinha", especie: "Cachorro", servico: "Banho", data: new Date("2026-11-11T09:30:00.000Z"), usuarioId: joao.id },
    ],
  });

  console.log("Seed concluído: 1 ADMIN, 2 USERs, 3 agendamentos (senha de todos: 123456)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
