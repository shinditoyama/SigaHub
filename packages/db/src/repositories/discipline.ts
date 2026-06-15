import { db } from "../config";
import { disciplines } from "../schema";

export class DisciplineRepository {
  async findAll() {
    const result = await db.select().from(disciplines);
    return result;
  }
}
