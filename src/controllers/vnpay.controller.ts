// app/api/payments/vnpay/create/route.ts
import moment from 'moment';
import { signParams } from '../lib/vnpay';
import type { RequestHandler } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import redisClient from '../db/redis_connection';
import { PaymentService } from '../services/payment.service';
import { PaymentStatus, type IVNPayCreateRequest } from '../types/payment';
import type { ObjectId } from 'mongoose';
import { vnpayCreateSchema } from '../schemas/payment.schema';
import UtilsService from '../services/utils.service';
import { ZodError } from 'zod';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);

  // Validate request body
  const validationResult = UtilsService.validateBody<IVNPayCreateRequest>(vnpayCreateSchema, req.body);
  if (validationResult instanceof ZodError) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, validationResult);
    return;
  }

  let { orderId, orderInfo, paymentIds } = validationResult;

  // Auto-generate orderId if not provided
  if (!orderId) {
    orderId = Date.now().toString();
  }

  if (redisClient) {
    await redisClient.set(`${orderId}`, JSON.stringify(paymentIds), { EX: 3600 });
  } else {
    console.log('** REDIS::NOTFOUND');
  }

  let amount = 0;
  // find payments and sum amount
  const paymentService = new PaymentService();
  const payments = await paymentService.findMany({
    filter: {
      _id: { $in: paymentIds },
    },
  });

  if (!payments.data || payments.data.length === 0) {
    appExpress.response400(ErrorCode.BAD_REQUEST, {
      message: 'No valid payments found for the provided payment IDs',
    });
    return;
  }

  payments.data.forEach((payment) => {
    amount += payment.amount;
  });

  if (amount <= 0) {
    appExpress.response400(ErrorCode.BAD_REQUEST, {
      message: 'Total payment amount must be greater than 0',
    });
    return;
  }

  const vnp_TmnCode = process.env.VNP_TMN_CODE!;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
  const vnp_Url = process.env.VNP_URL!;
  const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

  const createDate = moment().format('YYYYMMDDHHmmss');
  const txnRef = orderId;

  const params: Record<string, string | number> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: Number(amount) * 100,
    vnp_ReturnUrl,
    vnp_IpAddr:
      req.ip ||
      (Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for']) ||
      '127.0.0.1',
    vnp_CreateDate: createDate,
  };

  const vnp_SecureHash = signParams(params, vnp_HashSecret);

  const paymentUrl = `${vnp_Url}?${new URLSearchParams({
    ...params,
    vnp_SecureHash,
    vnp_SecureHashType: 'HmacSHA512',
  }).toString()}`;

  return appExpress.response200({ paymentUrl, txnRef });
};

const returnUrl: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  const paymentService = new PaymentService();
  const url = new URL(`${process.env.SERVER_URL}/api/v1/payment${req.url}`);
  const query = Object.fromEntries(url.searchParams.entries());
  let ids = [];
  if (redisClient) {
    if (query.vnp_TxnRef && query.vnp_ResponseCode === '00') { // payment successfull
      const idsString = await redisClient.get(query.vnp_TxnRef);
      ids = JSON.parse(idsString || '[]');
      const updatedPayment = Promise.all(ids.map(async (id: string) =>
        paymentService.update(id as unknown as ObjectId, {
          status: PaymentStatus.PAID,
        })
      ));
      
      const result = await updatedPayment;
      console.log('** RESULT::', result);
      
      
      await redisClient.del(query.vnp_TxnRef);
    } else {
      console.log('** QUERY[vnp_TxnRef]::NOTFOUND');
    }
  } else {
    console.log('** REDIS::NOTFOUND');
  }
  try {
  const secureHash = query['vnp_SecureHash'];
  delete query['vnp_SecureHash'];
  delete query['vnp_SecureHashType'];

  const checkHash = signParams(query, process.env.VNP_HASH_SECRET!);
  const isValid = secureHash === checkHash;
  console.log(
    'Payement result',
    `${query.vnp_ResponseCode}&valid=${isValid}&ref=${query.vnp_TxnRef}`,
  );
  return appExpress.res.redirect(
    `${process.env.CLIENT_URL}/payment/result?code=${query.vnp_ResponseCode}&valid=${isValid}&ref=${query.vnp_TxnRef}&payments=${ids}`,
  );
  } catch(e) {
    return appExpress.res.redirect(
      `${process.env.CLIENT_URL}/payment/result?code=XX&valid=${false}&payments=${ids}`,
    );
  }
};

const getIPN: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);

  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const receivedHash = query['vnp_SecureHash'];
  delete query['vnp_SecureHash'];
  delete query['vnp_SecureHashType'];

  const valid = receivedHash === signParams(query, process.env.VNP_HASH_SECRET!);
  const txnRef = query.vnp_TxnRef;
  const amount = Number(query.vnp_Amount || 0);
  const responseCode = query.vnp_ResponseCode;

  if (!valid) {
    return appExpress.response400(ErrorCode.BAD_REQUEST, {
      RspCode: '97',
      Message: 'Invalid signature',
    });
  }

  if (responseCode === '00') {
    // TODO: Update DB: mark txnRef = paid, lưu bankCode, payDate...
    return appExpress.response200({ RspCode: '00', Message: 'Confirm Success' });
  } else {
    // TODO: Update DB: mark failed
    return appExpress.response400(ErrorCode.BAD_REQUEST, {
      RspCode: '00',
      Message: 'Confirm Fail Recorded',
    });
  }
};

export default {
  create,
  returnUrl,
  getIPN,
};
