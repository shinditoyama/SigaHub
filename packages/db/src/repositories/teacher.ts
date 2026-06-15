import { db } from "../config";
import { teachers } from "../schema";

export class TeacherRepository {
  async findAll() {
    const result = await db.select().from(teachers);
    return result;
  }
}
