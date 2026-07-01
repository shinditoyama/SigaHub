import "dotenv/config"; // IMPORTANTE: Carrega o .env antes de tudo
import { db } from "./config";
import { disciplines, grades, users } from "./schema";

async function main() {
  console.log("🌱 Iniciando o seeding...");

  try {
    // 1. Limpar tabelas (opcional, cuidado em produção!)
    await db.delete(disciplines);
    await db.delete(grades);
    await db.delete(users);

    // 2. Inserir Usuario
    const userList = await db
      .insert(users)
      .values([
        {
          name: "Carlos Mendes",
          email: "carlos.mendes@escola.edu.br",
          role: "professor",
        },
        {
          name: "Juliana Alves",
          email: "juliana.alves@escola.edu.br",
          role: "professor",
        },
        {
          name: "Roberto Lima",
          email: "roberto.lima@escola.edu.br",
          role: "professor",
        },
        {
          name: "Lucas Oliveira",
          email: "lucas.oliveira@escola.edu.br",
          role: "professor",
        },
        {
          name: "Ana Beatriz Silva",
          email: "ana.silva@escola.edu.br",
          role: "estudante",
        },
        {
          name: "Maria Fernanda Costa",
          email: "maria.fernanda@escola.edu.br",
          role: "estudante",
        },
      ])
      .returning();

    console.log("✅ Usuário criado com sucesso!");

    const [t1, t2, t3, t4, t5, t6] = userList;

    // 3. Inserir Disciplina
    const subjecsList = await db
      .insert(disciplines)
      .values([
        { name: "Matemática", teacherId: t1?.id },
        { name: "Português", teacherId: t2?.id },
        { name: "História", teacherId: t3?.id },
        { name: "Física", teacherId: t4?.id },
      ])
      .returning();

    console.log("✅ Disciplina criado com sucesso!");

    const [d1, d2, d3, d4] = subjecsList;

    await db.insert(grades).values([
      {
        disciplineId: d1?.id,
        studentId: t5?.id,
        description: "Prova de matemática",
        score: 8.5,
      },
      {
        disciplineId: d2?.id,
        studentId: t6?.id,
        description: "Prova de português",
        score: 9.5,
      },
      {
        disciplineId: d3?.id,
        studentId: t5?.id,
        description: "Prova de história",
        score: 10,
      },
      {
        disciplineId: d4?.id,
        studentId: t6?.id,
        description: "Prova de física",
        score: 6.5,
      },
    ]);

    console.log("✅ Notas criado com sucesso!");

    console.log("✅ Seeding finalizado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

main();
