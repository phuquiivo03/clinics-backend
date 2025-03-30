import type { ObjectId } from "mongoose";

export interface ConsultationService {
    _id?: ObjectId;
    name: string;
    description: string;
    price: number;
}