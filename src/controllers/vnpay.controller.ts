// app/api/payments/vnpay/create/route.ts
import moment from 'moment';
import { signParams } from '../lib/vnpay';
import type { RequestHandler } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  const { amount, orderId, orderInfo = 'Thanh toan don hang' } = req.body;

  const vnp_TmnCode = process.env.VNP_TMN_CODE!;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
  const vnp_Url = process.env.VNP_URL!;
  const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

  const createDate = moment().format('YYYYMMDDHHmmss');
  const txnRef = orderId || Date.now().toString();

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
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const secureHash = query['vnp_SecureHash'];
  delete query['vnp_SecureHash'];
  delete query['vnp_SecureHashType'];

  const checkHash = signParams(query, process.env.VNP_HASH_SECRET!);
  const isValid = secureHash === checkHash;

  return appExpress.res.redirect(
    `/payment/result?code=${query.vnp_ResponseCode}&valid=${isValid}&ref=${query.vnp_TxnRef}`,
  );
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
