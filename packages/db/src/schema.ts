import { relations } from "drizzle-orm";
import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  //password: text("password").notNull(),

  gradeId: uuid("grade_id").references(() => grades.id, {
    onDelete: "set null",
  }),
  classId: uuid("class_id").references(() => class_sessions.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  //password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const disciplines = pgTable("disciplines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  teacherId: uuid("teacher_id").references(() => teachers.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const class_sessions = pgTable("class_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  disciplineId: uuid("discipline_id").references(() => disciplines.id, {
    onDelete: "set null",
  }),
  topic: text("topic").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const grades = pgTable("grades", {
  id: uuid("id").primaryKey().defaultRandom(),
  disciplineId: uuid("discipline_id").references(() => disciplines.id, {
    onDelete: "set null",
  }),
  assignmentName: text("assignmentName"),
  score: numeric("score", {
    precision: 3,
    scale: 1,
    mode: "number",
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- RELACIONAMENTOS (Drizzle Relations API) ---

export const studentRelations = relations(students, ({ one }) => ({
  class: one(class_sessions, {
    fields: [students.classId],
    references: [class_sessions.id],
  }),
  grade: one(grades, { fields: [students.gradeId], references: [grades.id] }),
}));

export const teacherRelations = relations(teachers, ({ many }) => ({
  subjects: many(disciplines),
  classes: many(class_sessions),
}));

export const gradeRelations = relations(grades, ({ many }) => ({
  students: many(students),
  classes: many(class_sessions),
}));

export const disciplineRelations = relations(disciplines, ({ many }) => ({
  teachers: many(teachers),
}));
