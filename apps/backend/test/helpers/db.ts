import type { Db } from 'mongodb';

import { DATABASE } from '../../src/database/database.module';

export async function clearDatabase(app: { get(token: symbol): Db }): Promise<void> {
  const db = app.get(DATABASE);
  const collections = await db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}
