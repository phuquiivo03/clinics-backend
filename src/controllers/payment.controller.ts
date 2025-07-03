import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import type { Bill, Payment } from '../types/payment';
import { PaymentStatus } from '../types/payment';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { Schema, type ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';
import schedule from '../models/schedule';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const paymentData: Payment = req.body;
      // Add the user ID from the authenticated user
      paymentData.user = req.user._id;
      
      const payment = await this.paymentService.create(paymentData);
      appExpress.response201(payment);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Payment ID is required',
        });
        return;
      }
      const payment = await this.paymentService.findById(new Schema.Types.ObjectId(id));
      if (!payment) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Payment not found' });
        return;
      }
      appExpress.response200(payment);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const payments = await this.paymentService.findAll();
      appExpress.response200(payments);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getUserPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const userId = req.user._id;
      const options: MongooseFindManyOptions = {
        filter: {
            user: userId,
        }
      }
      const payments = await this.paymentService.findMany(options);
      appExpress.response200(payments);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getPaymentsByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { status } = req.params;
      if (!status || !Object.values(PaymentStatus).includes(status as PaymentStatus)) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Valid payment status is required',
        });
        return;
      }
      const options: MongooseFindManyOptions = {
        filter: {
            status: status as PaymentStatus,
        }
      }
      const payments = await this.paymentService.findMany(options);
      appExpress.response200(payments);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getBillForPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const scheduleId  = req.params.scheduleId as string | '';
      if (!scheduleId) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Schedule ID is required',
        });
        return;
      }

      const options: MongooseFindManyOptions = {
        filter: {
          schedule: scheduleId as unknown as ObjectId,
        }
      }
      const payemnts = (await this.paymentService.findMany(options)).data;
      if (!payemnts || payemnts.length === 0) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Bill not found for the payment' });
        return;
      }

      const pendingPayment = payemnts.filter(payment => {
        return payment.status === PaymentStatus.PENDING;
      })

      const totalAmount = pendingPayment.reduce((total, payment) => total + payment.amount, 0)

      const bill: Bill = {
        totalAmount,
        payments: pendingPayment,
      }

      appExpress.response200(bill);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Payment ID is required',
        });
        return;
      }
      const payment = await this.paymentService.update(new Schema.Types.ObjectId(id), req.body);
      if (!payment) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Payment not found' });
        return;
      }
      appExpress.response200(payment);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Payment ID is required',
        });
        return;
      }
      
      if (!status || !Object.values(PaymentStatus).includes(status)) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Valid payment status is required',
        });
        return;
      }
      
      const payment = await this.paymentService.updatePaymentStatus(
        new Schema.Types.ObjectId(id),
        status
      );
      
      if (!payment) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Payment not found' });
        return;
      }
      
      appExpress.response200(payment);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Payment ID is required',
        });
        return;
      }
      const payment = await this.paymentService.delete(new Schema.Types.ObjectId(id));
      if (!payment) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Payment not found' });
        return;
      }
      appExpress.response200({ message: 'Payment deleted successfully' });
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }
} 