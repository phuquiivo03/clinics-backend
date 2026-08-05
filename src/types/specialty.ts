import type { ObjectId } from 'mongoose';

export interface Specialty {
  _id?: ObjectId;
  name: string;
  description: string;
}
