import type { ObjectId } from 'mongoose';
import type { Room } from './room';
import type { User } from './user';
import type { Specialty } from './specialty';
export interface ConsultationService {
  _id?: ObjectId;
  name: string;
  description: string;
  specialization?: Specialty | ObjectId;
  duration: number;
  room: Room | ObjectId;
  doctor: User | ObjectId;
  price: number;
}
