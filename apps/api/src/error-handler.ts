import type { FastifyInstance } from "fastify";
import z, { ZodError } from "zod";
import { BadRequest } from "./errors/bad-request";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação nos dados enviados.",
      errors: z.treeifyError(error),
    });
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Erro interno do servidor." });
};
