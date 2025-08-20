import { GENDER } from '../types';

export type ICreateUserRequest = {
  phoneNumber: string;
  password: string;
};

export type IUnsignupUserRequest = {
  phoneNumber: string;
  name?: string;
  email?: string;
  dateOfBirth?: Date;
  address?: string;
  gender?: GENDER;
};

export type IUpdateUserInfoRequest = {
  name: string;
  email?: string;
  dateOfBirth: Date;
  gender: GENDER;
  address: string;
  avatar: string;
};
