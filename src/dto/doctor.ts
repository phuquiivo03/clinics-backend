import type { ObjectId } from "mongoose";

export type ICreateDoctorRequest = {
    specialization: string;
    experience: number;
    qualifications: string[];
    consultationFee: number;
}