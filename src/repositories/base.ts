import type { ClientSession, Model, ObjectId } from 'mongoose';
import type {
  MongooseFindManyOptions,
  MongooseFindOneOptions,
  MongooseUpdateOptions,
} from './type';
import type { Pagination } from '../types/response';
import type { AppResponse } from '../dto/response';

interface BaseRepository<T> {
  create(data: Partial<T>, session?: ClientSession): Promise<T | null>;
  createMany(data: Partial<T[]>, session?: ClientSession): Promise<T[] | null>;
  findOne(options: MongooseFindOneOptions): Promise<T | null>;
  findById(
    id: ObjectId,
    options?: MongooseFindOneOptions,
    session?: ClientSession,
  ): Promise<T | null>;
  update(id: ObjectId, data: Partial<T>, options: MongooseUpdateOptions): Promise<T | null>;
  findAll(options?: MongooseFindManyOptions): Promise<AppResponse<T[]>>;
  delete(id: ObjectId): Promise<T | null>;
  findMany(options?: MongooseFindManyOptions): Promise<AppResponse<T[]>>;
}

class BaseRepositoryImpl<T> implements BaseRepository<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>, session?: ClientSession): Promise<T | null> {
    try {
      const doc: T[] = await this.model.create([data], { session });
      return doc[0] || null;
    } catch (error) {
      throw error;
    }
  }

  async findOne(options: MongooseFindOneOptions): Promise<T | null> {
    try {
      if (options.filter) {
        return this.model.findOne(options.filter);
      }
      return this.model.findOne(options);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<T | null> {
    const query = this.model.findById(id);
    if (options && options.selectFields) {
      query.select(options.selectFields);
    }
    if (options && options.populateOptions) {
      query.populate(options.populateOptions);
    }
    return query.exec();
  }

  async update(
    id: ObjectId,
    data: Partial<T>,
    options: MongooseUpdateOptions = {
      new: true,
      upsert: false,
    },
  ): Promise<T | null> {
    try {
      return this.model.findByIdAndUpdate(id, data, options).exec();
    } catch (e) {
      throw e;
    }
  }

  async findAll(
    options?: MongooseFindManyOptions,
  ): Promise<AppResponse<T[]>> {
    try {
      // Just delegate to findMany with the provided options
      return this.findMany(options);
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: Partial<T[]>): Promise<T[] | null> {
    try {
      const createdData = this.model.insertMany(data);
      if (createdData) {
        return createdData;
      }
      throw new Error('Invalid data');
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<T | null> {
    try {
      return this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    options?: MongooseFindManyOptions,
  ): Promise<AppResponse<T[]>> {
    console.log('FINDMANY::OPTIONS', options);
    try {
      const filter = options?.filter || {};

      // Get total count first
      const totalCount = await this.model.countDocuments(filter).exec();

      // Then get the data with pagination
      const query = this.model.find(filter);
      if (options?.pagination) {
        query.skip(((options.pagination.page || 1) - 1) * (options.pagination.limit || 10));
        query.limit(options.pagination.limit || 10);
      }

      if (options?.selectFields) {
        query.select(options.selectFields);
      }

      if (options?.sort) {
        query.sort(options.sort);
      }

      if (options?.populateOptions) {
        console.log('POPULATE::OPTIONS', options.populateOptions);
        query.populate(options.populateOptions);
      }

      const data = await query.exec();

      return {
        data,
        pagination: {
          total: totalCount,
          page: options?.pagination?.page || 1,
          limit: options?.pagination?.limit || 10,
          totalPages: Math.ceil(totalCount / (options?.pagination?.limit || 10)),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export { BaseRepositoryImpl, type BaseRepository };
