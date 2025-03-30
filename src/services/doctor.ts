import { DoctorRepositoryImpl, type DoctorRepository } from "../repositories";
import type { MongooseFindOneOptions } from "../repositories/type";
import type { Doctor } from "../types";

class DoctorService {
    readonly doctorRepository: DoctorRepository;
    constructor() {
        this.doctorRepository = new DoctorRepositoryImpl();
    }

    async create(data: Partial<Doctor>): Promise<Doctor> {
        console.log(data)
        try {
            const createdDoctor =  this.doctorRepository.create(data);
            if(!createdDoctor || createdDoctor == null) {
                throw new Error('Invalid doctor data');
            }
            // @ts-ignore
            return createdDoctor;
        }catch(error) {
            throw error;
        }
    }

    async findAll(): Promise<Doctor[] | []> {
        try {
            return this.doctorRepository.findAll();
        }catch(error) {
            throw error;
        }
    }

    async findOne(options: MongooseFindOneOptions): Promise<Doctor | null> {
        try {
            return this.doctorRepository.findOne(options);
        }catch(error) {
            throw error;
        }
    }
}

const doctorService = new DoctorService();

export default doctorService;