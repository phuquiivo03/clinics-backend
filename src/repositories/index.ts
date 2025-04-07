export * from "./user";
export * from "./doctor";
export * from "./consultationPackage";
export * from "./consultationService";
export * from "./otp";
export * from "./schedule";
export * from "./room";
export * from "./periodPackage";
export * from "./dayPackage";
export * from "./packageWeek";

import scheduleRepository from './schedule';
import roomRepository from './room';
import periodPackageRepository from './periodPackage';
import dayPackageRepository from './dayPackage';
import packageWeekRepository from './packageWeek';

export {
    scheduleRepository,
    roomRepository,
    periodPackageRepository,
    dayPackageRepository,
    packageWeekRepository
}