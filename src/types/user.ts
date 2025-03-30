import type { Document, ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: ROLE;
  phoneNumber: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: GENDER;
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
  MALE = "male",
  FEMALE="female",
  OTHER="other"
}