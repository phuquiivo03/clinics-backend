import type { ObjectId } from 'mongoose';
import type { User } from './user';

export interface Image {
  url: string;
  user: ObjectId | User;
}
