import type { Payment, PaymentStatus } from '../types/payment';
import { type PaymentRepository, PaymentRepositoryImpl } from '../repositories/payment';
import type { ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { Pagination } from '../types/response';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepositoryImpl();
  }

  async create(payment: Omit<Payment, '_id'>): Promise<Payment | null> {
    return await this.paymentRepository.create(payment);
  }

  async findById(id: ObjectId): Promise<Payment | null> {
    return await this.paymentRepository.findById(id);
  }

  async findAll(): Promise<{
    data: Payment[] | [];
    pagination: Pagination;
}> {
    return await this.paymentRepository.findMany();
  }

  async findMany(options?: MongooseFindManyOptions): Promise<{
    data: Payment[] | [];
    pagination: Pagination;
}> {
    return await this.paymentRepository.findMany(options);
  }

  async update(id: ObjectId, payment: Partial<Payment>): Promise<Payment | null> {
    return await this.paymentRepository.update(id, payment, { new: true });
  }

  async delete(id: ObjectId): Promise<Payment | null> {
    return await this.paymentRepository.delete(id);
  }





  async updatePaymentStatus(id: ObjectId, status: PaymentStatus): Promise<Payment | null> {
    return await this.paymentRepository.update(id, { status }, { new: true });
  }
} 