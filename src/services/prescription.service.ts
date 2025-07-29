import { PrescriptionRepositoryImpl, type PrescriptionRepository } from '../repositories';
import type { Prescription } from '../types';
import type { ObjectId } from 'mongoose';
import type { Pagination } from '../types/response';

class PrescriptionService {
  private prescriptionRepository: PrescriptionRepository;

  constructor() {
    this.prescriptionRepository = new PrescriptionRepositoryImpl();
  }

  async create(data: Prescription): Promise<Prescription> {
    try {
      const prescription = await this.prescriptionRepository.create(data);
      if (!prescription) {
        throw new Error('Failed to create prescription');
      }
      return prescription;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: ObjectId): Promise<Prescription | null> {
    try {
      return await this.prescriptionRepository.findById(id, {
        populateOptions: {
          path: 'doctor patient medications',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getByPatientId(patientId: ObjectId): Promise<{ data: Prescription[]; pagination: Pagination }> {
    try {
      return await this.prescriptionRepository.findMany({
        filter: { patient: patientId },
        populateOptions: {
          path: 'doctor medications',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getByDoctorId(doctorId: ObjectId): Promise<{ data: Prescription[]; pagination: Pagination }> {
    try {
      return await this.prescriptionRepository.findMany({
        filter: { doctor: doctorId },
        populateOptions: {
          path: 'patient medications',
          select: 'name email phoneNumber',
        },

        sort: { createdAt: -1 },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: ObjectId, data: Partial<Prescription>): Promise<Prescription | null> {
    try {
      return await this.prescriptionRepository.update(id, data, {});
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(id: ObjectId, isPaid: boolean): Promise<Prescription | null> {
    try {
      return await this.prescriptionRepository.update(id, { isPaid }, {});
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<Prescription | null> {
    try {
      return await this.prescriptionRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getAll(filters?: {
    isPaid?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: Prescription[]; pagination: Pagination }> {
    try {
      const filter: any = {};

      if (filters?.isPaid !== undefined) {
        filter.isPaid = filters.isPaid;
      }

      if (filters?.startDate || filters?.endDate) {
        filter.dateIssued = {};
        if (filters.startDate) {
          filter.dateIssued.$gte = filters.startDate;
        }
        if (filters.endDate) {
          filter.dateIssued.$lte = filters.endDate;
        }
      }

      return await this.prescriptionRepository.findMany({
        filter,
        populateOptions: {
          path: 'doctor patient medications',
        },
        sort: { createdAt: -1 },
      });
    } catch (error) {
      throw error;
    }
  }
}

const prescriptionService = new PrescriptionService();

export default prescriptionService;
