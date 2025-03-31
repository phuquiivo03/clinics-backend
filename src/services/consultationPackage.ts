import  { type ConsultationPackageRepository, ConsultationPackageRepositoryImpl } from "../repositories";
import type { MongooseFindManyOptions } from "../repositories/type";
import type { ConsultationPackage } from "../types";

class ConsultationPackageService {
    readonly consultationPackageRepository: ConsultationPackageRepository;

    constructor() {
        this.consultationPackageRepository = new ConsultationPackageRepositoryImpl();
    }   

    async create(data: Partial<ConsultationPackage>): Promise<ConsultationPackage> {
        try {
            const createdPackage = await this.consultationPackageRepository.create(data);
            if(createdPackage) {
                return createdPackage;
            }
            throw new Error('Invalid package data');
        }catch(error) {
            throw error;
        }
    }

    async findAll(options: MongooseFindManyOptions): Promise<ConsultationPackage[]> {
        try {
            return this.consultationPackageRepository.findAll(options);
        }catch(error) {
            throw error;
        }
    }
}

const consultationPackageService = new ConsultationPackageService();
export default consultationPackageService;