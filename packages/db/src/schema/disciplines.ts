import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { grades } from "./grades";
import { users } from "./users";

// Tabela de Disciplinas
export const disciplines = pgTable("disciplines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  //code: text("code").notNull().unique(), // Ex: 'MAT101'
  //color: text("color").notNull(), // Guarda o hexadecimal da cor (Ex: '#3B82F6')
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- RELACIONAMENTOS (Drizzle Relations API) ---

export const disciplinesRelations = relations(disciplines, ({ one, many }) => ({
  teacher: one(users, {
    fields: [disciplines.teacherId],
    references: [users.id],
  }),
  //classSessions: many(classSessions),
  grades: many(grades),
}));

// Inferência de tipos do Drizzle para Seleção e Inserção

export type Discipline = typeof disciplines.$inferSelect;
export type NewDiscipline = typeof disciplines.$inferInsert;
