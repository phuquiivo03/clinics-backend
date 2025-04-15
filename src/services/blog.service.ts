import type { Blog } from '../types/blogs';
import { type BlogRepository, BlogRepositoryImpl } from '../repositories';
import type { ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';

export class BlogService {
  private blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogRepositoryImpl();
  }

  async create(blog: Omit<Blog, '_id'>): Promise<Blog | null> {
    return await this.blogRepository.create(blog);
  }

  async createMany(blogs: Omit<Blog, '_id'>[]): Promise<Blog[]> {
    try {
      const createdBlogs = await this.blogRepository.createMany(blogs);
      if (!createdBlogs) {
        throw new Error('Failed to create blogs');
      }
      return createdBlogs;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId): Promise<Blog | null> {
    return await this.blogRepository.findById(id);
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.findAll();
  }

  async findMany(options?: MongooseFindManyOptions): Promise<Blog[]> {
    return await this.blogRepository.findMany(options);
  }

  async update(id: ObjectId, blog: Partial<Blog>): Promise<Blog | null> {
    return await this.blogRepository.update(id, blog, { new: true });
  }

  async delete(id: ObjectId): Promise<Blog | null> {
    return await this.blogRepository.delete(id);
  }

  async toggleStatus(id: ObjectId): Promise<Blog | null> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) return null;

    return await this.blogRepository.update(id, { active: !blog.active }, { new: true });
  }
}
