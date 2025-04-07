import type { ObjectId } from "mongoose";

export interface packaggeWeek {
    _id?: ObjectId,
    startDate: Date,
    endDate: Date,
}