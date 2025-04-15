import type { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';
import type { Blog } from '../types/blogs';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { Schema, type ObjectId } from 'mongoose';
import redisClient from '../db/redis_connection';

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const blogData: Omit<Blog, '_id'> = {
        ...req.body,
        author: req.user?._id,
      };
      const blog = await this.blogService.create(blogData);
      appExpress.response201(blog);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async createMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const blogsData: Omit<Blog, '_id'>[] = req.body.map((blog: any) => ({
        ...blog,
        author: req.user?._id,
      }));
      const blogs = await this.blogService.createMany(blogsData);
      appExpress.response201(blogs);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: (error as Error).message,
      });
    }
  }

  async findActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const redisKey = `blogs:active-:${page}:${limit}`;
      const cachedBlogs = await redisClient.get(redisKey);
      if (cachedBlogs) {
        appExpress.response200(JSON.parse(cachedBlogs));
        return;
      }
      const blogs = await this.blogService.findMany({
        filter: { active: true },
        pagination: { page, limit },
        selectFields: ['_id', 'title', 'coverImage', 'createdAt', 'updatedAt'],
      });
      await redisClient.set(redisKey, JSON.stringify(blogs), { EX: 30 });
      appExpress.response200(blogs);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Blog ID is required',
        });
        return;
      }
      const blog = await this.blogService.findById(id as unknown as ObjectId);
      if (!blog) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Blog not found' });
        return;
      }
      appExpress.response200(blog);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const blogs = await this.blogService.findAll();
      appExpress.response200(blogs);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Blog ID is required',
        });
        return;
      }
      const blog = await this.blogService.update(new Schema.Types.ObjectId(id), req.body);
      if (!blog) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Blog not found' });
        return;
      }
      appExpress.response200(blog);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Blog ID is required',
        });
        return;
      }
      const blog = await this.blogService.delete(new Schema.Types.ObjectId(id));
      if (!blog) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Blog not found' });
        return;
      }
      appExpress.response200({ message: 'Blog deleted successfully' });
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Blog ID is required',
        });
        return;
      }
      const blog = await this.blogService.toggleStatus(new Schema.Types.ObjectId(id));
      if (!blog) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Blog not found' });
        return;
      }
      appExpress.response200(blog);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }
}
