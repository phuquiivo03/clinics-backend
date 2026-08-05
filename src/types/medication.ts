import type { ObjectId } from 'mongoose';

export type Medication = {
  _id?: ObjectId; // Optional ID for the medication, can be used for updates
  medicine: ObjectId | Medicine; // Reference to the medicine
  quantity: number;
  frequency: string; // e.g. "1 viên x 3 lần/ngày"
  duration: string; // e.g. "5 ngày"
  instruction?: string; // e.g. "Sau khi ăn"
};

export type Medicine = {
  _id?: ObjectId; // Optional ID for the medicine, can be used for updates
  name: string; // Name of the medicine
  dosage: string; // e.g. "500mg"
  form: string; // e.g. "Viên nén"
  route: string; // e.g. "Uống"
};
