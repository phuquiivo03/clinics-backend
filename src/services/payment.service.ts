import { type Payment, PaymentStatus } from '../types/payment';
import { type PaymentRepository, PaymentRepositoryImpl } from '../repositories/payment';
import type { ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { Pagination } from '../types/response';
import scheduleService from './schedule.service';
import type { Schedule } from '../types/schedules';

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
    const updatedPayment = await this.paymentRepository.update(id, payment, { new: true });
    
    // If the payment was updated and either status or amount changed, update the schedule's totalPaid
    if (updatedPayment && (payment.status !== undefined || payment.amount !== undefined)) {
      const schedule = await scheduleService.findById(updatedPayment.schedule as ObjectId, {
        populateOptions: {
          path: 'payments.payments',
        },
      });

      if (schedule) {
        // Calculate the new totalPaid based on all PAID payments
        let totalPaid = 0;
        const payments = schedule.payments.payments as Payment[];
        
        for (const schedulePayment of payments) {
          if (schedulePayment.status === PaymentStatus.PAID) {
            totalPaid += schedulePayment.amount;
          }
        }

        // Update only the totalPaid field in the schedule
        // Get the payment IDs (not the populated objects)
        const paymentIds = schedule.payments.payments.map((p: any) => 
          typeof p === 'object' && p._id ? p._id : p
        );
        
        await scheduleService.update(
          schedule._id as ObjectId,
          {
            payments: {
              payments: paymentIds,
              totalPrice: schedule.payments.totalPrice,
              totalPaid: totalPaid,
            },
          },
        );
      }
    }
    
    return updatedPayment;
  }

  async delete(id: ObjectId): Promise<Payment | null> {
    // Get the payment before deleting to know which schedule to update
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      return null;
    }

    // Delete the payment
    const deletedPayment = await this.paymentRepository.delete(id);
    
    if (deletedPayment) {
      // Find and update the schedule
      const schedule = await scheduleService.findById(payment.schedule as ObjectId, {
        populateOptions: {
          path: 'payments.payments',
        },
      });

      if (schedule) {
        // Calculate the new totalPaid based on remaining PAID payments
        let totalPaid = 0;
        const payments = schedule.payments.payments as Payment[];
        
        for (const remainingPayment of payments) {
          // Skip the deleted payment
          if (remainingPayment._id?.toString() !== id.toString() && 
              remainingPayment.status === PaymentStatus.PAID) {
            totalPaid += remainingPayment.amount;
          }
        }

        // Update only the totalPaid field in the schedule
        // Get the payment IDs (not the populated objects)
        const paymentIds = schedule.payments.payments.map((p: any) => 
          typeof p === 'object' && p._id ? p._id : p
        );
        
        await scheduleService.update(
          schedule._id as ObjectId,
          {
            payments: {
              payments: paymentIds,
              totalPrice: schedule.payments.totalPrice,
              totalPaid: totalPaid,
            },
          },
        );
      }
    }

    return deletedPayment;
  }

  async updatePaymentStatus(id: ObjectId, status: PaymentStatus): Promise<Payment | null> {
    // First update the payment status
    const updatedPayment = await this.paymentRepository.update(id, { status }, { new: true });
    
    if (!updatedPayment) {
      return null;
    }

    // Find the schedule that contains this payment
    const schedule = await scheduleService.findById(updatedPayment.schedule as ObjectId, {
      populateOptions: {
        path: 'payments.payments',
      },
    });

    if (schedule) {
      // Calculate the new totalPaid based on all PAID payments
      let totalPaid = 0;
      const payments = schedule.payments.payments as Payment[];
      
      for (const payment of payments) {
        if (payment.status === PaymentStatus.PAID) {
          console.log("PAIED::", payment.amount);
          totalPaid += payment.amount;
        }
      }
      console.log("TOTAL PAID::", totalPaid);
      // Update only the totalPaid field in the schedule
      // Get the payment IDs (not the populated objects)
      const paymentIds = schedule.payments.payments.map((p: any) => 
        typeof p === 'object' && p._id ? p._id : p
      );
      
      await scheduleService.update(
        schedule._id as ObjectId,
        {
          payments: {
            payments: paymentIds,
            totalPrice: schedule.payments.totalPrice,
            totalPaid: totalPaid,
          },
        },
      );
    }

    return updatedPayment;
  }
}
