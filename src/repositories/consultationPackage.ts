import { consulationPackageModel } from "../models";
import type { ConsultationPackage } from "../types";
import { BaseRepositoryImpl, type BaseRepository } from "./base";


interface ConsultationPackageRepository extends BaseRepository<ConsultationPackage>{}

class ConsultationPackageRepositoryImpl extends BaseRepositoryImpl<ConsultationPackage> implements ConsultationPackageRepository {
    constructor() {
        super(consulationPackageModel);
    }
}

export { type ConsultationPackageRepository, ConsultationPackageRepositoryImpl };