import { GradeRepository } from "@repo/db";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

const gradeRepository = new GradeRepository();

export const gradeRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/grades",
    { schema: { summary: "List grades", tags: ["Grades"] } },
    async (_, reply) => {
      const grade = await gradeRepository.findAll();
      reply.send(grade);
    },
  );

  app.post(
    "/grades/create",
    {
      schema: {
        summary: "Register a new grade",
        tags: ["Grades"],
        body: z.object({
          disciplineId: z.uuid(),
          studentId: z.uuid(),
          description: z.string().min(2),
          score: z.number(),
        }),
        response: {
          201: z.object({ gradeId: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { disciplineId, studentId, description, score } = request.body;

      const data = {
        disciplineId,
        studentId,
        description,
        score,
      };

      const grade = await gradeRepository.create(data);

      return reply.status(201).send({ gradeId: grade?.id as string });
    },
  );
};
