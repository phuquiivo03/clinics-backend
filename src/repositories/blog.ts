import type { Blog } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import { BlogModel } from '../models/blog.model';
interface BlogRepository extends BaseRepository<Blog> {}

class BlogRepositoryImpl extends BaseRepositoryImpl<Blog> implements BlogRepository {
  constructor() {
    super(BlogModel);
  }
}

export { type BlogRepository, BlogRepositoryImpl };
