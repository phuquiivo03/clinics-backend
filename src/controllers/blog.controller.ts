import type { Request, Response, NextFunction } from 'express';
import blogService from '../services/blog.service';
import type { Blog } from '../types/blogs';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { Schema, type ObjectId } from 'mongoose';
import redisClient from '../db/redis_connection';
import pinataService from '../services/pinata.service';
import fs from 'fs';
import { config } from '../config';
export class BlogController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      if (!req.file) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, { error: 'No file uploaded' });
        return;
      }

      // Create a File object from the uploaded file
      const file = new File([fs.readFileSync(req.file.path)], req.file.originalname, {
        type: req.file.mimetype,
      });

      // Upload to Pinata
      const imageUrl = await pinataService.uploadFile(file);

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
      const blogData: Omit<Blog, '_id'> = {
        ...req.body,
        author: req.user?._id,
        coverImage: `${config.pinata.viewUrl}${imageUrl.cid}`,
      };
      const blog = await blogService.create(blogData);
      appExpress.response201(blog);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error: (error as Error).message });
    }
  }

  async createMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const blogsData: Omit<Blog, '_id'>[] = req.body.map((blog: any) => ({
        ...blog,
        author: req.user?._id,
      }));
      const blogs = await blogService.createMany(blogsData);
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
      const blogs = await blogService.findMany({
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
      const blog = await blogService.findById(id as unknown as ObjectId);
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
      const blogs = await blogService.findAll();
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
      const blog = await blogService.update(new Schema.Types.ObjectId(id), req.body);
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
      const blog = await blogService.delete(new Schema.Types.ObjectId(id));
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
      const blog = await blogService.toggleStatus(new Schema.Types.ObjectId(id));
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
