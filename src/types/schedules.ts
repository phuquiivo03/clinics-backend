import type { ObjectId } from "mongoose";
import type { User } from "./user";
import type { ConsultationService } from "./consultationService";
import type { ConsultationPackage } from "./consultationPackage";

export interface Schedule {
  id?: ObjectId;
  userId: ObjectId | User;
  date: Date;
  start_time: string;
  end_time: string;
  status: string;
  package_id?: ObjectId | ConsultationPackage;
}
