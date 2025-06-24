import type { ObjectId } from 'mongoose';
import type { Doctor } from './doctor';
import type { User } from './user';
import type { Medication } from './medication';

export interface Prescription {
  _id: string; // Mã đơn thuốc
  dateIssued: string; // ISO date string
  doctor: Doctor | ObjectId; // Reference to the doctor who issued the prescription
  patient: User | ObjectId;
  diagnosis: string;
  notes?: string;
  medications: (Medication | ObjectId)[]; // Array of medications prescribed, can be a mix of both
  totalCost: number;
  isPaid: boolean;
}
