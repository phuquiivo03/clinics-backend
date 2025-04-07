import { periodPackageModel } from "../models";
import type { PeriodPackage } from "../types/periodPackage";
import { BaseRepositoryImpl, type BaseRepository } from "./base";

interface PeriodPackageRepository extends BaseRepository<PeriodPackage> {}

class PeriodPackageRepositoryImpl extends BaseRepositoryImpl<PeriodPackage> implements PeriodPackageRepository {
    constructor() {
        super(periodPackageModel);
    }
}

export { type PeriodPackageRepository, PeriodPackageRepositoryImpl };
export default new PeriodPackageRepositoryImpl(); 