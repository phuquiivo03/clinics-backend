import { doctorModel } from "../models";
import type { Doctor } from "../types";
import { BaseRepositoryImpl, type BaseRepository } from "./base";


interface DoctorRepository extends BaseRepository<Doctor>{}

class DoctorRepositoryImpl extends BaseRepositoryImpl<Doctor> implements DoctorRepository {
    constructor() {
        super(doctorModel);
    }
}

export { type DoctorRepository, DoctorRepositoryImpl };