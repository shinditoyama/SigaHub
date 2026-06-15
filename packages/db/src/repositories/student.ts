import { db } from "../config";
import { students } from "../schema";

export class StudentRepository {
  async findAll() {
    const result = await db.select().from(students);
    return result;
  }
}
