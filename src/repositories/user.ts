import type { Model, ObjectId } from 'mongoose';
import type { User } from '../types';
import { userModel } from '../models';
import type { MongooseFindOneOptions, MongooseUpdateOptions } from './type';
import { BaseRepositoryImpl, type BaseRepository } from './base';

interface UserRepository extends BaseRepository<User> {}
class UserRepositoryImpl extends BaseRepositoryImpl<User> implements UserRepository {
  constructor() {
    super(userModel);
  }

  async create(data: User): Promise<User | null> {
    try {
      return this.model.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findOne(options: MongooseFindOneOptions): Promise<User | null> {
    try {
      if (options.filter) {
        return this.model.findOne(options.filter);
      }
      return this.model.findOne(options);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<User | null> {
    const query = this.model.findById(id);
    if (options && options.selectFields) {
      query.select(options.selectFields);
    }
    return query.exec();
  }


  async update(
    id: ObjectId,
    data: Partial<User>,
    options: MongooseUpdateOptions = {
      new: true,
      upsert: false,
    },
  ): Promise<User | null> {
    try {
      return this.model.findByIdAndUpdate(id, data, options).exec();
    } catch (e) {
      throw e;
    }
  }
}

const userRepository = new UserRepositoryImpl();

export { userRepository, type UserRepository };
