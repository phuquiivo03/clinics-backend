import { type ObjectId } from "mongoose";
import packageWeekRepository from "../repositories/packageWeek";
import type { packageWeek as PackageWeek } from "../types/packageWeek";
import dayPackageService from "./dayPackage";
import type { MongooseFindOneOptions } from "../repositories/type";

class PackageWeekService {
    async create(data: Partial<PackageWeek>): Promise<PackageWeek | null> {
        try {
            const packageWeek = await packageWeekRepository.create(data);
            if (packageWeek) {
                return packageWeek;
            }
            throw new Error('Invalid package week data');
        } catch (error) {
            throw error;
        }
    }

    async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<PackageWeek | null> {
        try {
            return packageWeekRepository.findById(id, options);
        } catch (error) {
            throw error;
        }
    }

    async findWithFullDetails(id: ObjectId): Promise<PackageWeek | null> {
        try {
            return packageWeekRepository.findWithFullDetails(id);
        } catch (error) {
            throw error;
        }
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<PackageWeek[]> {
        try {
            return packageWeekRepository.findByDateRange(startDate, endDate);
        } catch (error) {
            throw error;
        }
    }

    async update(id: ObjectId, data: Partial<PackageWeek>): Promise<PackageWeek | null> {
        try {
            return packageWeekRepository.update(id, data, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: ObjectId): Promise<PackageWeek | null> {
        try {
            return packageWeekRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async addDayPackage(id: ObjectId, dayPackageId: ObjectId): Promise<PackageWeek | null> {
        try {
            const packageWeek = await packageWeekRepository.findById(id);
            if (!packageWeek) {
                throw new Error('Package week not found');
            }

            // Check if the day package exists
            const dayPackage = await dayPackageService.findById(dayPackageId);
            if (!dayPackage) {
                throw new Error('Day package not found');
            }

            // Add day package to package week
            const packageDays = [...packageWeek.packageDays, dayPackageId] as any;
            return packageWeekRepository.update(id, { packageDays }, { new: true });
        } catch (error) {
            throw error;
        }
    }
}

const packageWeekService = new PackageWeekService();
export default packageWeekService; 