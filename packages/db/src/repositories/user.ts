import { eq } from "drizzle-orm";
import { db } from "../config";
import { type NewUser, users } from "../schema/users";

export class UserRepository {
  async findAll() {
    //const result = await db.select().from(users);
    const result = await db.query.users.findMany({
      // where: eq(users.role, "professor"),
      with: {
        disciplines: {
          columns: {
            name: true,
          },
        },
        grades: {
          columns: {
            score: true,
            description: true,
          },
        },
      },
    });
    return result;
  }

  async findByEmail(email: string) {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result;
  }

  async create(data: NewUser) {
    const [result] = await db.insert(users).values(data).returning();
    return result;
  }
}
