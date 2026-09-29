-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomePet" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADO',
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Agendamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
