import type { RequestHandler } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import pinataService from '../services/pinata.service';
import fs from 'fs';
import imageService from '../services/image.service';
import { config } from '../config';

const create: RequestHandler = async (req, res, next) => {
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
    const createdImage = await imageService.create({
      user: req.user._id,
      url: `${config.pinata.viewUrl}${imageUrl.cid}`,
    });
    appExpress.response200(createdImage);
    // Clean up the temporary file
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error: (error as Error).message });
  }
};

export default { create };
