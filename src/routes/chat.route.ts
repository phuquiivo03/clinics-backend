import { Router } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import fs from 'fs';
import axios from 'axios';
import { config } from '../config';
const router = Router();

router.post('/', async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const response = await axios({
      method: 'POST', // giữ nguyên HTTP method
      url: `${config.aiService.url}/chat`, // URL mới
      headers: { ...req.headers }, // forward toàn bộ headers
      params: req.query, // forward query string
      data: req.body, // forward body
      validateStatus: () => true, // để không throw error khi status >= 400
    });

    console.log(response.data)
    appExpress.response200(response.data,
    );
    // Clean up the temporary file
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error: (error as Error).message });
  }
});

export default router;
