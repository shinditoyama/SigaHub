import { DisciplineRepository } from "@repo/db";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

const disciplineRepository = new DisciplineRepository();

export const disciplineRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/disciplines",
    { schema: { summary: "List disciplines", tags: ["Disciplines"] } },
    async (_, reply) => {
      const discipline = await disciplineRepository.findAll();
      return reply.send(discipline);
    },
  );

  app.post(
    "/disciplines/create",
    {
      schema: {
        summary: "Register a new discipline",
        tags: ["Disciplines"],
        body: z.object({
          name: z.string().min(2),
          teacherId: z.uuid(),
        }),
        response: {
          201: z.object({ disciplineId: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { name, teacherId } = request.body;

      const data = {
        name,
        teacherId,
      };

      const discipline = await disciplineRepository.create(data);

      return reply.status(201).send({ disciplineId: discipline?.id as string });
    },
  );
};
