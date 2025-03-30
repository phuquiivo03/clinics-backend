import type { ObjectId } from "mongoose";

export type IConsultationPackageRequest =  {
    name: string;
    description: string;
    duration: number;
    price: number;
    services: ObjectId[];
}