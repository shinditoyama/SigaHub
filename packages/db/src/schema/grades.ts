import { relations } from "drizzle-orm";
import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { disciplines } from "./disciplines";
import { users } from "./users";

// Tabela de Notas e Avaliações
export const grades = pgTable("grades", {
  id: uuid("id").primaryKey().defaultRandom(),

  disciplineId: uuid("discipline_id")
    .notNull()
    .references(() => disciplines.id, { onDelete: "set null" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),

  description: text("description").notNull(), // Ex: 'Prova 1 - Álgebra'
  score: numeric("score", { precision: 4, scale: 1, mode: "number" }).notNull(), // Notas escolares usam precisão decimal (Ex: 8.5)
  //maxScore: integer('maxScore').notNull(), // Pontuação máxima (Ex: 10)
  //date: text('date').notNull(), // Data no formato 'AAAA-MM-DD'
  //feedback: text('feedback').default(''), // Comentário do professor
  //term: text('term').notNull(), // Bimestre/Período (Ex: '1º Bimestre')
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- RELACIONAMENTOS (Drizzle Relations API) ---

export const gradesRelations = relations(grades, ({ one }) => ({
  discipline: one(disciplines, {
    fields: [grades.disciplineId],
    references: [disciplines.id],
  }),
  student: one(users, { fields: [grades.studentId], references: [users.id] }),
}));

// Inferência de tipos do Drizzle para Seleção e Inserção

export type Grade = typeof grades.$inferSelect;
export type NewGrade = typeof grades.$inferInsert;
