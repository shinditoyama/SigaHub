import { UserRepository } from "@repo/db";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequest } from "../errors/bad-request";

const userRepository = new UserRepository();

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/users",
    { schema: { summary: "List users", tags: ["Users"] } },
    async (_, reply) => {
      const user = await userRepository.findAll();
      return reply.send(user);
    },
  );

  app.post(
    "/users/create",
    {
      schema: {
        summary: "Register a new user",
        tags: ["Users"],
        body: z.object({
          name: z.string().min(2),
          email: z.email(),
          // password: z.string().min(8),
        }),
        response: {
          201: z.object({ userId: z.string() }),
          // 201: z.null().describe("User created"),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;

      const existingUser = await userRepository.findByEmail(email);

      if (existingUser) {
        throw new BadRequest("Email already exists");
      }

      const data = {
        name,
        email,
      };

      const user = await userRepository.create(data);

      return reply.status(201).send({ userId: user?.id as string });
    },
  );
};
