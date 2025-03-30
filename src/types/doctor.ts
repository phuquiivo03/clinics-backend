import type { ObjectId, Document } from "mongoose";

export interface Doctor extends Document {
    user: ObjectId;
    specialization: string;
    experience: number;
    qualifications: string[];
    bio: string;
    consultationFee?: number;
    availability: IDoctorAvailability[];
    reviews: IDoctorReview[];
    averageRating: number;
  }
  
  export type IDoctorAvailability = {
      day: string;
      startTime: string;
      endTime: string;
  }

  export type IDoctorReview = {
      user: ObjectId;
      rating: number;
      comment: string;
      date: Date;
  }