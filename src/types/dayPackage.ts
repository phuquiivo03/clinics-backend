import type { ObjectId } from "mongoose";
import type { ConsultationPackage } from "./consultationPackage";
import type { PeriodPackage } from "./periodPackage";

export interface DayPackage {
    day_offset: number
    period_pkgs: ObjectId[] | PeriodPackage[]
}