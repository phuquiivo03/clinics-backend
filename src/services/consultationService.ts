import  { type ConsultationServiceRepository, ConsultationServiceRepositoryImpl } from "../repositories";
import type { ConsultationService } from "../types";

class ConsultationServiceService {
    readonly consultationServiceRepository: ConsultationServiceRepository;

    constructor() {
        this.consultationServiceRepository = new ConsultationServiceRepositoryImpl();
    }   

    async create(data: Partial<ConsultationService>): Promise<ConsultationService> {
        try {
            const createdPackage = await this.consultationServiceRepository.create(data);
            if(createdPackage) {
                return createdPackage;
            }
            throw new Error('Invalid package data');
        }catch(error) {
            throw error;
        }
    }

    async createMany(data: Partial<ConsultationService[]>): Promise<ConsultationService[]> {
        try {
            const createdPackage = await this.consultationServiceRepository.createMany(data);
            if(createdPackage) {
                return createdPackage;
            }
            throw new Error('Invalid package data');
        }catch(error) {
            throw error;
        }
    }

    async findAll(): Promise<ConsultationService[]> {
        try {
            return this.consultationServiceRepository.findAll();
        }catch(error) {
            throw error;
        }
    }
}

const consultationServiceService = new ConsultationServiceService();

export default consultationServiceService;