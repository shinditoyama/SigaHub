import {
  DisciplineRepository,
  StudentRepository,
  TeacherRepository,
} from "@repo/db";
import { z } from "zod";
import type { ZodFastifyInstance } from "./types";

interface User {
  name: string;
  email: string;
}

const users: User[] = [];

const disciplineRepository = new DisciplineRepository();
const studentRepository = new StudentRepository();
const teacherRepository = new TeacherRepository();

export async function routes(app: ZodFastifyInstance) {
  app.get("/discipline", async (_, reply) => {
    const d = await disciplineRepository.findAll();
    reply.send(d);
  });

  app.get("/student", async (_, reply) => {
    const s = await studentRepository.findAll();
    reply.send(s);
  });

  app.get("/teacher", async (_, reply) => {
    const t = await teacherRepository.findAll();
    reply.send(t);
  });

  app.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "List users",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              email: z.string(),
            }),
          ),
        },
      },
    },
    async (_, reply) => {
      return reply.send(users);
    },
  );

  app.post(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "Create a new user",
        body: z.object({ name: z.string(), email: z.email() }),
        response: {
          201: z.null().describe("User created"),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;

      users.push({
        name,
        email,
      });

      return reply.status(201).send(null);
    },
  );
}
