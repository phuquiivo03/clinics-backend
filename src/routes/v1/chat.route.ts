import { Router } from 'express';
import { CustomExpress } from '../../pkg/app/response';
import { ErrorCode } from '../../pkg/e/code';
import fs from 'fs';
import axios from 'axios';
import { config } from '../../config';
import multer from 'multer';
import FormData from 'form-data';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', upload.any(), async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  console.log('req.body', req.body);
  console.log('req.files', req.files);

  try {
    let requestData;
    let headers = { ...req.headers };

    // Check if there are files in the request
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Handle multipart/form-data with files
      const formData = new FormData();

      // Add all form fields
      Object.keys(req.body).forEach((key) => {
        formData.append(key, req.body[key]);
      });

      // Add all files
      req.files.forEach((file: any) => {
        formData.append(file.fieldname, fs.createReadStream(file.path), {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });

      requestData = formData;
      // Remove content-type header to let axios set it with boundary
      delete headers['content-type'];
      headers = { ...headers, ...formData.getHeaders() };
    } else {
      // Handle regular JSON data
      requestData = req.body;
    }

    const response = await axios({
      method: 'POST',
      url: `${config.aiService.url}/chat`,
      headers: headers,
      params: req.query,
      data: requestData,
      validateStatus: () => true,
    });

    // Clean up temporary files if any
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    appExpress.response200(response.data);
  } catch (error) {
    // Clean up temporary files in case of error
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error: (error as Error).message });
  }
});

export default router;
