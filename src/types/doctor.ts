import type { ObjectId, Document } from "mongoose";

export interface IDoctor extends Document {
    user: ObjectId;
    specialization: string;
    experience: number;
    qualifications: string[];
    bio: string;
    consultationFee: number;
    availability: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
    reviews: {
      user: ObjectId;
      rating: number;
      comment: string;
      date: Date;
    }[];
    averageRating: number;
  }
  