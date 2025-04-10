import type { Model, ObjectId } from 'mongoose';
import type {
  MongooseFindManyOptions,
  MongooseFindOneOptions,
  MongooseUpdateOptions,
} from './type';

interface BaseRepository<T> {
  create(data: Partial<T>): Promise<T | null>;
  createMany(data: Partial<T[]>): Promise<T[] | null>;
  findOne(options: MongooseFindOneOptions): Promise<T | null>;
  findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<T | null>;
  update(id: ObjectId, data: Partial<T>, options: MongooseUpdateOptions): Promise<T | null>;
  findAll(options?: MongooseFindManyOptions): Promise<T[] | []>;
  delete(id: ObjectId): Promise<T | null>;
}

class BaseRepositoryImpl<T> implements BaseRepository<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T | null> {
    try {
      return this.model.create(data);
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

  async findAll(options?: MongooseFindManyOptions): Promise<T[] | []> {
    try {
      if (options && options.selectFields) {
        return this.model.find().select(options.selectFields);
      }
      return this.model.find();
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
}

export { BaseRepositoryImpl, type BaseRepository };
