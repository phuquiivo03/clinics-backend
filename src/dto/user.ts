import type { GENDER } from "../types";

export type ICreateUserRequest = {
    password: string;
}


export type IUpdateUserInfoRequest = {
    name: string;
    email: string;
    dateOfBirth: Date;
    gender: GENDER;
    address: string;
}