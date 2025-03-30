import { consultationServiceModel } from "../models";
import type { ConsultationService } from "../types";
import { BaseRepositoryImpl, type BaseRepository } from "./base";


interface ConsultationServiceRepository extends BaseRepository<ConsultationService>{}

class ConsultationServiceRepositoryImpl extends BaseRepositoryImpl<ConsultationService> implements ConsultationServiceRepository {
    constructor() {
        super(consultationServiceModel);
    }
}

export { type ConsultationServiceRepository, ConsultationServiceRepositoryImpl };