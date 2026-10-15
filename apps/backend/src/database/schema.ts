import type { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}

export type NewUser = Omit<User, '_id' | 'createdAt'>;
