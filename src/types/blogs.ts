import type { ObjectId } from 'mongoose';
import type { User } from './user';

export interface Blog {
  _id?: ObjectId;
  title: string;
  coverImage: string;
  content: string;
  active: boolean;
  author: User | ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
