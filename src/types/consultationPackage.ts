import type { ObjectId } from 'mongoose';
import type { ConsultationService } from './consultationService';

export interface ConsultationPackage {
  _id?: ObjectId; // Unique identifier
  category: string;
  titleImage: string; // Icon URL
  title: string; // Package name (e.g., "Viêm khớp")
  description: string; // Brief details about the package
  content: string;
  price: number;
  tests: ConsultationService[] | ObjectId[]; // List of test categories and individual tests
  condition: string;
  maxSlotPerPeriod: number;
  faq?: FAQItem[]; // Frequently asked questions
  bookingOption: string; // Methods to book the package
}

export interface PriceOption {
  tier: string; // "Basic", "Advanced", etc.
  price: number; // Price in VND
  testsIncluded: number; // Number of tests included
}

export interface FAQItem {
  question: string; // FAQ question
  answer: string; // FAQ answer
}

export interface BookingOption {
  type: 'Branch' | 'Home Sample Collection';
  description: string; // Details of the option
  actionUrl: string; // Link to book the service
}
