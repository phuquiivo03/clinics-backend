import type { ObjectId } from "mongoose";

export interface OTP {
    _id: ObjectId;
    code: string;
    phoneNumber: string;
    createAt: Date;
}