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
import type { MongooseFindManyOptions } from '../repositories/type';

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

  async findMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      // Parse options from query parameter if provided, otherwise use default options
      let options: MongooseFindManyOptions = {
        sort: { createdAt: -1 }, // Sort by creation date, newest first
        pagination: {
          page: 1,
          limit: 10,
        },
      };

      // If options are provided as a JSON string, parse them
      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string) as MongooseFindManyOptions;
        } catch (error) {
          return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
            message: 'Invalid options format. Please provide a valid JSON string.',
          });
        }
      } else {
        // Handle individual query parameters if options is not provided
        const { page = 1, limit = 10, title, active, specialties } = req.query;

        // Build filter object based on query parameters
        const filter: Record<string, any> = {};
        if (active !== undefined) filter.active = active === 'true';
        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (specialties) {
          // Handle specialties as comma-separated list
          const specialtyIds = (specialties as string).split(',');
          filter.specialties = { $in: specialtyIds };
        }

        options = {
          filter,
          pagination: {
            page: Number(page),
            limit: Number(limit),
          },
          sort: { createdAt: -1 }, // Sort by creation date, newest first
        };
      }

      const result = await blogService.findMany(options);
      appExpress.response200(result);
    } catch (error) {
      console.error(error);
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
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

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      // At this point, req.query is already validated by the middleware
      const { q: searchTerm, page = 1, limit = 10, activeOnly = true } = req.query as any;
      
      // Check Redis cache first
      const redisKey = `blogs:search:${searchTerm}:${page}:${limit}:${activeOnly}`;
      const cachedResults = await redisClient.get(redisKey);
      
      if (cachedResults) {
        appExpress.response200(JSON.parse(cachedResults));
        return;
      }
      
      const blogs = await blogService.search(searchTerm, { page, limit, activeOnly });
      
      // Cache the results for 5 minutes
      await redisClient.set(redisKey, JSON.stringify(blogs), { EX: 300 });
      
      appExpress.response200(blogs);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { 
        error: (error as Error).message 
      });
    }
  }
}
