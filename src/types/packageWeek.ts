import type { ObjectId } from "mongoose";
import type { DayPackage } from "./dayPackage";

export interface packageWeek {
    _id?: ObjectId,
    startDate: Date,
    endDate: Date,
    packageDays: DayPackage[]
}