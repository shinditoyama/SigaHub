import "dotenv/config"; // IMPORTANTE: Carrega o .env antes de tudo
import { db } from "./config";
import {
  class_sessions,
  disciplines,
  grades,
  students,
  teachers,
} from "./schema";

async function main() {
  console.log("🌱 Iniciando o seeding...");

  try {
    // 1. Limpar tabelas (opcional, cuidado em produção!)
    await db.delete(teachers);
    await db.delete(students);
    await db.delete(disciplines);

    // 2. Inserir Professor
    const teachersList = await db
      .insert(teachers)
      .values([
        {
          name: "Carlos Mendes",
          email: "carlos.mendes@escola.edu.br",
        },
        {
          name: "Juliana Alves",
          email: "juliana.alves@escola.edu.br",
        },
        {
          name: "Roberto Lima",
          email: "roberto.lima@escola.edu.br",
        },
        {
          name: "Lucas Oliveira",
          email: "lucas.oliveira@escola.edu.br",
        },
      ])
      .returning();

    const [t1, t2, t3, t4] = teachersList;

    // 2. Inserir Professor

    // 3. Inserir Disciplina
    const subjecsList = await db
      .insert(disciplines)
      .values([
        { name: "Matemática", teacherId: t1?.id },
        { name: "Português", teacherId: t1?.id },
        { name: "História", teacherId: t2?.id },
        { name: "Física", teacherId: t3?.id },
        { name: "Biologia", teacherId: t4?.id },
      ])
      .returning();

    const [d1, d2, d3, d4, d5] = subjecsList;

    // 4. Inserir Aula
    await db.insert(class_sessions).values([
      {
        disciplineId: d1?.id,
        topic: "Equações do 2º Grau",
      },
      {
        disciplineId: d2?.id,
        topic: "Análise Sintática",
      },
      {
        disciplineId: d3?.id,
        topic: "Brasil Imperial",
      },
      {
        disciplineId: d4?.id,
        topic: "Cinemática",
      },
      {
        disciplineId: d5?.id,
        topic: "Genética Molecular",
      },
    ]);

    await db.insert(grades).values([
      {
        disciplineId: d1?.id,
        score: 8.5,
        assignmentName: "Prova de matemática",
      },
    ]);

    await db
      .insert(students)
      .values([
        {
          name: "Ana Beatriz Silva",
          email: "ana.silva@escola.edu.br",
        },
        {
          name: "Maria Fernanda Costa",
          email: "maria.fernanda@escola.edu.br",
        },
      ])
      .returning();

    console.log("✅ Seeding finalizado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

main();
