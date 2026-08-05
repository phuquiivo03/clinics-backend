import { PinataSDK } from 'pinata';
import { config } from '../config';

class PinataService {
  private readonly pinataInstance: PinataSDK;

  constructor() {
    this.pinataInstance = new PinataSDK({
      pinataJwt: config.pinata.jwt,
      pinataGateway: config.pinata.gateway,
    });
  }

  async uploadFile(file: File) {
    const upload = await this.pinataInstance.upload.public.file(file);
    return upload;
  }
}

const pinataService = new PinataService();
export default pinataService;
