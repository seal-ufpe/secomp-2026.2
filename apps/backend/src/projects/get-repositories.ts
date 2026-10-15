import { MongoClient } from 'mongodb';
import { createFakeRepositories } from './fake-repositories';
import { createMongoRepositories } from './mongo-repositories';
import type { Repositories } from './repositories';

const globalState = globalThis as typeof globalThis & { __deployRepositories?: Promise<Repositories> };

export function getRepositories(): Promise<Repositories> {
  if (process.env.USE_FAKE_DB === '1') {
    globalState.__deployRepositories ??= Promise.resolve(createFakeRepositories());
    return globalState.__deployRepositories;
  }
  globalState.__deployRepositories ??= (async () => {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    if (!uri || !dbName) throw new Error('MONGODB_URI e MONGODB_DB são obrigatórios.');
    const client = new MongoClient(uri);
    await client.connect();
    return createMongoRepositories(client.db(dbName));
  })();
  return globalState.__deployRepositories;
}
