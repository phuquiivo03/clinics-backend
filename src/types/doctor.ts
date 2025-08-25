import type { ObjectId, Document } from 'mongoose';
import type { Specialty } from './specialty';
import type { Room } from './room';
export interface Doctor extends Document {
  user: ObjectId;
  specialization: ObjectId | Specialty;
  experience: number;
  qualifications: string[];
  bio: string;
  consultationFee?: number;
  availability: IDoctorAvailability[];
  reviews: IDoctorReview[];
  averageRating: number;
  room: ObjectId | Room;
}

export type IDoctorAvailability = {
  day: string;
  startTime: string;
  endTime: string;
};

export type IDoctorReview = {
  user: ObjectId;
  rating: number;
  comment: string;
  date: Date;
};
