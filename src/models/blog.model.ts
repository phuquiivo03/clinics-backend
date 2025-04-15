import { model } from 'mongoose';
import { BlogSchema } from '../schemas/blog.schema';
import type { Blog } from '../types/blogs';

export const BlogModel = model<Blog>('Blog', BlogSchema);
