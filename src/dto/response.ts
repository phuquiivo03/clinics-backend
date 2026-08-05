import type { Pagination } from '../types/response';

export type AppResponse<T> = {
  data: T;
  pagination: Pagination;
};
