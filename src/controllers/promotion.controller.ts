import type { Request, Response, NextFunction } from 'express';
import { PromotionService } from '../services/promotion.service';
import type { Promotion } from '../types/promotion';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { Schema } from 'mongoose';

export class PromotionController {
  private promotionService: PromotionService;

  constructor() {
    this.promotionService = new PromotionService();
  }

  async createPromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const promotionData: Omit<Promotion, '_id'> = req.body;
      const promotion = await this.promotionService.create(promotionData);
      appExpress.response201(promotion);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async createManyPromotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const promotionsData: Omit<Promotion, '_id'>[] = req.body;
      const promotions = await this.promotionService.createMany(promotionsData);
      appExpress.response201(promotions);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getPromotionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Promotion ID is required',
        });
        return;
      }
      const promotion = await this.promotionService.findById(new Schema.Types.ObjectId(id));
      if (!promotion) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Promotion not found' });
        return;
      }
      appExpress.response200(promotion);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getAllPromotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const promotions = await this.promotionService.findAll();
      appExpress.response200(promotions);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getActivePromotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const promotions = await this.promotionService.findActive();
      appExpress.response200(promotions);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async updatePromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Promotion ID is required',
        });
        return;
      }
      const promotion = await this.promotionService.update(new Schema.Types.ObjectId(id), req.body);
      if (!promotion) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Promotion not found' });
        return;
      }
      appExpress.response200(promotion);
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async deletePromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Promotion ID is required',
        });
        return;
      }
      const promotion = await this.promotionService.delete(new Schema.Types.ObjectId(id));
      if (!promotion) {
        appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Promotion not found' });
        return;
      }
      appExpress.response200({ message: 'Promotion deleted successfully' });
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { error });
    }
  }
}
