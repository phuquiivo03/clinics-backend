import { imageModel } from '../models';
import type { Image } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import type { MongooseFindOneOptions } from './type';

interface ImageRepository extends BaseRepository<Image> {}

class ImageRepositoryImpl extends BaseRepositoryImpl<Image> implements ImageRepository {
  constructor() {
    super(imageModel);
  }

  async findOne(options: MongooseFindOneOptions): Promise<Image | null> {
    try {
      return this.model.findOne(options);
    } catch (error) {
      throw error;
    }
  }
}

export { type ImageRepository, ImageRepositoryImpl };
export default new ImageRepositoryImpl();
