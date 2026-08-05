import type { ObjectId } from 'mongoose';
import type { PriceOption, FAQItem, BookingOption, ConsultationService } from '../types';

export type IConsultationPackageRequest = {
  _id?: ObjectId; // Unique identifier
  title: string; // Package name (e.g., "Viêm khớp")
  icon: string; // Icon URL
  description?: string; // Brief details about the package
  features: string[]; // List of benefits (e.g., early detection, progress tracking)
  priceOptions: PriceOption[]; // Different package tiers (Basic, Advanced)
  maxSlotPerPeriod: number;
  tests: ObjectId[]; // List of test categories and individual tests
  faq?: FAQItem[]; // Frequently asked questions
  bookingOptions?: BookingOption[]; // Methods to book the package
};
