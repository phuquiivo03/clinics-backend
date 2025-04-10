import type { ObjectId } from 'mongoose';

export interface User {
  _id?: ObjectId;
  name: string | null;
  email: string | null;
  password?: string;
  role: ROLE;
  phoneNumber: string;
  address: string | null;
  dateOfBirth: Date | null;
  gender: GENDER | null;
  occupation: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  doctor?: ObjectId;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export enum ROLE {
  ADMIN = 'admin',
  NORMAL = 'user',
  DOCTOR = 'doctor',
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
