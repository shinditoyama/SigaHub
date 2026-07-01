import { db } from "../config";
import { grades, type NewGrade } from "../schema/grades";

export class GradeRepository {
  async findAll() {
    // const result = await db.select().from(grades);
    const result = await db.query.grades.findMany({
      with: {
        student: {
          columns: {
            name: true,
            email: true,
          },
        },
        discipline: {
          columns: {
            name: true,
          },
        },
      },
    });
    return result;
  }

  async create(data: NewGrade) {
    const [result] = await db.insert(grades).values(data).returning();
    return result;
  }
}
