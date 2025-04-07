import { consulationPackageModel } from "../models";
import type { ConsultationPackage } from "../types";
import { BaseRepositoryImpl, type BaseRepository } from "./base";
import type { ObjectId } from "mongoose";

interface ConsultationPackageRepository extends BaseRepository<ConsultationPackage> {
    findByIdWithFullDetails(id: ObjectId): Promise<ConsultationPackage | null>;
}

class ConsultationPackageRepositoryImpl extends BaseRepositoryImpl<ConsultationPackage> implements ConsultationPackageRepository {
    constructor() {
        super(consulationPackageModel);
    }

    async findByIdWithFullDetails(id: ObjectId): Promise<ConsultationPackage | null> {
        try {
            return this.model.findById(id)
                .populate({
                    path: 'tests',
                    populate: {
                        path: 'room doctor'
                    }
                })
                .exec();
        } catch (error) {
            throw error;
        }
    }
}

export { type ConsultationPackageRepository, ConsultationPackageRepositoryImpl };