import type { ObjectId } from "mongoose";
import type { User } from "./user";
import type { ConsultationService } from "./consultationService";

export interface Schedule {
  id?: ObjectId;
  doctor_id: ObjectId | User;
  room_id: ObjectId;
  service_id: ObjectId | ConsultationService;
  date: Date;
  start_time: string;
  end_time: string;
  status: string;
  package_id?: ObjectId;
}
