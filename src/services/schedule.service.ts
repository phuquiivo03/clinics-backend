import { type ClientSession, type ObjectId } from 'mongoose';
import scheduleRepository from '../repositories/schedule';
import type { Schedule, SchedulePaymentInfo } from '../types/schedules';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { Pagination } from '../types/response';
import type { AppResponse } from '../dto/response';
import { PaymentMethod, PaymentStatus, type Payment } from '../types/payment';
import type { ConsultationService } from '../types';
import type { ScheduleService as ScheduleServiceType } from '../types/schedules';
import { PaymentService } from './payment.service';
class ScheduleService {
  async create(data: Partial<Schedule>, session?: ClientSession): Promise<Schedule | null> {
    try {
      const schedule = await scheduleRepository.create(data, session);
      if (schedule) {
        return schedule;
      }
      throw new Error('Invalid schedule data');
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: ObjectId,
    options?: MongooseFindOneOptions,
    session?: ClientSession,
  ): Promise<Schedule | null> {
    try {
      return scheduleRepository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  async findMany(options?: MongooseFindManyOptions): Promise<AppResponse<Schedule[]>> {
    try {
      return scheduleRepository.findAll(options);
    } catch (error) {
      throw error;
    }
  }

  async recalculateTotalPaid(id: ObjectId) {
    try {
      const schedule = await scheduleRepository.findById(id, {
        populateOptions: {
          path: 'payments.payments services.service',
        },
      });

      // check which service is not add payment
      if (!schedule?.services) {
        return;
      }
      let paymentObject = schedule?.payments as SchedulePaymentInfo;
      const services = schedule?.services as ScheduleServiceType[];
      let payments = paymentObject.payments as Payment[];
      const paymentIds = payments.map((payment) => payment._id as ObjectId);
      const serviceIds = services.map((service) => service.service as ObjectId);
      const newServices = services.filter(
        (service) => !paymentIds.includes(service.service as ObjectId),
      );

      // create payment for new service
      const createdPaymentsPromise = await Promise.all(
        newServices.map(async (svc) => {
          // Tạo dữ liệu payment
          const paymentData: Omit<Payment, '_id'> = {
            schedule: id,
            service: svc.service as ObjectId,
            method: PaymentMethod.CASH,
            amount: (svc.service as ConsultationService).price,
            status: PaymentStatus.PENDING,
            note: 'Added service payment',
            user: schedule?.userId as ObjectId,
          };

          const paymentService = new PaymentService();
          const createdPayment = await paymentService.create(paymentData);

          if (!createdPayment) {
            throw new Error('Failed to create payment');
          }

          return createdPayment;
        }),
      );
      const paymentsCreated = await Promise.all(createdPaymentsPromise);
      payments = [...payments, ...paymentsCreated];
      // remove payment for removed service

      const removedPaymentIds = payments
        .filter((payment) => !serviceIds.includes(payment.service as ObjectId))
        .map((payment) => payment._id as ObjectId);
      removedPaymentIds.forEach(async (paymentId) => {
        payments = payments.filter((payment) => {
          if (payment._id?.toString() === paymentId.toString()) {
            paymentObject.totalPrice = paymentObject.totalPrice - payment.amount;
          }
          return payment._id?.toString() !== paymentId.toString();
        });
        const paymentService = new PaymentService();
        await paymentService.delete(paymentId);
      });

      //calculate the totalPrice
      const total = payments.reduce((acc, payment) => acc + payment.amount, 0);

      // update schedule
      paymentObject.payments = payments;
      paymentObject.totalPrice = total;
      console.log('PAYMENT::', paymentObject);
      return await this.update(id, {
        payments: paymentObject,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: ObjectId,
    schedule: Partial<Schedule>,
    session?: ClientSession,
  ): Promise<Schedule | null> {
    try {
      console.log('SCHEDULE::paid', schedule.payments?.totalPaid);
      return scheduleRepository.update(id, schedule, { session, new: true });
    } catch (error) {
      throw error;
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
