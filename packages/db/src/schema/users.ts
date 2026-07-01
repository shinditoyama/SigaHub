import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { disciplines } from "./disciplines";
import { grades } from "./grades";

// Tabela de Usuários (Estudantes e Professores)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["estudante", "professor"] })
    .notNull()
    .default("estudante"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- RELACIONAMENTOS (Drizzle Relations API) ---

export const usersRelations = relations(users, ({ many }) => ({
  disciplines: many(disciplines), // Caso o usuário seja um professor
  grades: many(grades), // Caso o usuário seja um estudante
}));

// Inferência de tipos do Drizzle para Seleção e Inserção

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
