import { db } from "../config";
import { disciplines, type NewDiscipline } from "../schema/disciplines";

export class DisciplineRepository {
  async findAll() {
    // const result = await db.select().from(disciplines);
    const result = await db.query.disciplines.findMany({
      with: {
        teacher: {
          columns: {
            name: true,
            email: true,
          },
        },
        grades: {
          with: {
            student: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
          columns: {
            studentId: true,
            description: true,
            score: true,
          },
        },
      },
    });
    return result;
  }

  async create(data: NewDiscipline) {
    const [result] = await db.insert(disciplines).values(data).returning();
    return result;
  }
}
