import type { ObjectId } from "mongoose";

export type ICD = {
    _id?: ObjectId;
  code: string;
  range: string;
  title: string;
};