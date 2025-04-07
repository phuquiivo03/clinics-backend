import type { ObjectId } from "mongoose";
import type { ConsultationPackage } from "./consultationPackage";

export interface DayPackages {
    _id?: ObjectId,
    day_pkg_id: ObjectId
    pkg_id: ObjectId | ConsultationPackage,
    booked: number
}