import type { ObjectId } from "mongoose";
import type { ConsultationService } from "./consultationService";

export interface ConsultationPackage {
    _id?: ObjectId;
    name: string;
    description: string;
    duration: number;
    price: number;
    services: ConsultationService[] | ObjectId[];
}