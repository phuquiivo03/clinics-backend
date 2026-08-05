import type { ObjectId } from 'mongoose';

export type ICreateBlogRequest = {
  title: string;
  coverImage: string;
  content: string;
  active?: boolean;
  specialties?: ObjectId[];
};

export type IUpdateBlogRequest = {
  title?: string;
  coverImage?: string;
  content?: string;
  active?: boolean;
  specialties?: ObjectId[];
};
