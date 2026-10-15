import type { ObjectId } from 'mongodb';

export type User = {
  _id?: ObjectId;
  name: string;
  email: string;
  createdAt: Date;
};

export type NewUser = Omit<User, '_id' | 'createdAt'>;
