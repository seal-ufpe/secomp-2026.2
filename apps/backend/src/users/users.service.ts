import { Inject, Injectable } from '@nestjs/common';
import type { Db } from 'mongodb';

import { DATABASE } from '../database/database.module';
import type { NewUser } from '../database/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Db) {}

  list(): Promise<unknown[]> {
    return this.db.collection('users').find().sort({ createdAt: -1 }).toArray();
  }

  async create(input: NewUser): Promise<unknown[]> {
    const user = { ...input, createdAt: new Date() };
    const result = await this.db.collection('users').insertOne(user);
    return [{ ...user, _id: result.insertedId }];
  }
}
