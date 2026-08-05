import type { ObjectId } from 'mongoose';
import user from '../models/user';
import { type UserRepository, userRepository } from '../repositories';
import type { User } from '../types';
import jwt from 'jsonwebtoken';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { Pagination } from '../types/response';
import type { AppResponse } from '../dto/response';
// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30d',
  });
};
class UserService {
  readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = userRepository;
  }

  async login(phoneNumber: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        filter: { phoneNumber },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (!(await user.comparePassword(password))) {
        throw new Error('Invalid password');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(data: User): Promise<User> {
    // Check if user already exists
    const userExists = await this.userRepository.findOne({
      filter: { phoneNumber: data.phoneNumber },
    });

    if (userExists) {
      throw new Error('User already exists');
    }
    // Create user
    const createdUser = await this.userRepository.create(data);
    if (createdUser) {
      return this.userWithoutPassword(createdUser);
    } else {
      throw new Error('Invalid user data');
    }
  }

  async findById(id: ObjectId): Promise<User | null> {
    try {
      return this.userRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAndUpdate(id: ObjectId, data: Partial<User>): Promise<User | null> {
    try {
      return this.userRepository.update(id, data, { new: true, upsert: false });
    } catch (error) {
      throw error;
    }
  }

  userWithoutPassword(user: User): User {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      occupation: user.occupation,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      comparePassword(enteredPassword) {
        return user.comparePassword(enteredPassword);
      },
    };
  }

  async findOne(options: MongooseFindOneOptions): Promise<User | null> {
    try {
      if (options.filter) {
        return this.userRepository.findOne({ filter: options.filter });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async findMany(options?: MongooseFindManyOptions): Promise<AppResponse<User[]>> {
    try {
      const result = await this.userRepository.findMany(options);
      // Remove password from all users
      const usersWithoutPassword = result.data.map((user) => this.userWithoutPassword(user));
      return {
        data: usersWithoutPassword,
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await user.comparePassword(password);
  }
}

const userService = new UserService();

export default userService;
