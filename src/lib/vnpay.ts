// lib/vnpay.js
import crypto from 'crypto';

export function sortObject(obj: any) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((k) => {
      // @ts-ignore
      sorted[k] = obj[k];
    });
  return sorted;
}

export function signParams(params: any, secret: any) {
  const sorted = sortObject(params);
  const signData = new URLSearchParams(sorted).toString();
  return crypto.createHmac('sha512', secret).update(signData, 'utf-8').digest('hex');
}
