import type { ObjectId } from "mongoose";
import type { Room } from "./room";
import type { User } from "./user";

export interface ConsultationService {
    _id?: ObjectId;
    name: string;
    description: string;
    duration: number;
    room: Room | ObjectId;
    doctor: User | ObjectId;
    price: number;
}