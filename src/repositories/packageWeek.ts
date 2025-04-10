import { packageWeekModel } from "../models";
import type { packageWeek as PackageWeek } from "../types/packageWeek";
import { BaseRepositoryImpl, type BaseRepository } from "./base";
import type { ObjectId } from "mongoose";

interface PackageWeekRepository extends BaseRepository<PackageWeek> {
    findWithFullDetails(id: ObjectId): Promise<PackageWeek | null>;
    findByDateRangeWithFullDetails(startDate: Date, endDate: Date): Promise<PackageWeek[]>;
}

class PackageWeekRepositoryImpl extends BaseRepositoryImpl<PackageWeek> implements PackageWeekRepository {
    constructor() {
        super(packageWeekModel);
    }

    async findWithFullDetails(id: ObjectId): Promise<PackageWeek | null> {
        try {
            return this.model.findById(id)
                .populate({
                    path: 'packageDays',
                    populate: {
                        path: 'period_pkgs',
                        populate: {
                            path: 'pkg'
                        }
                    }
                })
                .exec();
        } catch (error) {
            throw error;
        }
    }

    async findByDateRangeWithFullDetails(startDate: Date, endDate: Date): Promise<PackageWeek[]> {
        try {
            return this.model.find({
                $or: [
                    { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
                    { startDate: { $gte: startDate, $lte: endDate } },
                    { endDate: { $gte: startDate, $lte: endDate } }
                ]
            })
            .populate({
                path: 'packageDays',
                populate: {
                    path: 'period_pkgs',
                    populate: {
                        path: 'pkg'
                    }
                }
            }).exec();
        } catch (error) {
            throw error;
        }
    }
}

export { type PackageWeekRepository, PackageWeekRepositoryImpl };
export default new PackageWeekRepositoryImpl(); 