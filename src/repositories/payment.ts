import type { Payment } from '../types/payment';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import { PaymentModel } from '../models/payment.model';

interface PaymentRepository extends BaseRepository<Payment> {}

class PaymentRepositoryImpl extends BaseRepositoryImpl<Payment> implements PaymentRepository {
  constructor() {
    super(PaymentModel);
  }
}

export { PaymentRepositoryImpl, type PaymentRepository };
