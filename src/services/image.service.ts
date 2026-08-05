import { ImageRepositoryImpl, type ImageRepository } from '../repositories/image';
import type { Image } from '../types';

class ImageService {
  readonly imageRepository: ImageRepository;

  constructor() {
    this.imageRepository = new ImageRepositoryImpl();
  }

  async create(image: Image): Promise<Image | null> {
    const createdImage = await this.imageRepository.create(image);
    return createdImage;
  }
}

const imageService = new ImageService();

export default imageService;
