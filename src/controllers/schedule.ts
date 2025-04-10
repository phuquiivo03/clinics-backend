import type { RequestHandler } from "express";
import { periodPackageService, scheduleService } from "../services";
import { CustomExpress } from "../pkg/app/response";
import { ErrorCode } from "../pkg/e/code";
import type { Schedule } from "../types/schedules";
import type { ObjectId } from "mongoose";
import mongoose from "mongoose";
import { createScheduleSchema, findScheduleByIdSchema } from "../schemas";
import periodPackage from "./periodPackage";

const create: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        // Validate the request body against schema
        const validationResult = createScheduleSchema.safeParse(req.body);
        if (!validationResult.success) {
            return appExpress.response400(
                ErrorCode.INVALID_REQUEST_BODY,
                validationResult.error.format()
            );
        }
        // Add date conversion
        const scheduleData: any = validationResult.data;
        scheduleData.date = new Date(scheduleData.date);
        
        const schedule = await scheduleService.create(scheduleData);
        if (schedule) {
            const period_pkg_id: ObjectId = scheduleData.package_period_id as unknown as ObjectId;
            const period_pkg = await periodPackageService.findById(period_pkg_id);
            if (period_pkg) {
                period_pkg.booked += 1;
                await periodPackageService.update(period_pkg_id, period_pkg);
                return appExpress.response201(schedule);
            }else {
                return appExpress.response404(ErrorCode.NOT_FOUND, {
                    message: 'Period package not found'
                });
            }
        }
        throw new Error('Invalid schedule data');
    } catch (error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
    }
};

// Add a method to find schedules by user ID
const findByUserId: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const userId = req.params.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
        }
        
        const objectId: ObjectId = userId as unknown as ObjectId;
        const schedules = await scheduleService.findByUserId(objectId);
        return appExpress.response200(schedules);
    } catch (error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
    }
};

const findById: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        // Validate the ID parameter
        const validationResult = findScheduleByIdSchema.safeParse({ id: req.params.id });
        if (!validationResult.success) {
            return appExpress.response400(
                ErrorCode.INVALID_REQUEST_PARAMS,
                validationResult.error.format()
            );
        }

        const id = req.params.id as unknown as ObjectId;
        const schedule = await scheduleService.findById(id);
        if (schedule) {
            return appExpress.response200(schedule);
        }
        appExpress.response404(ErrorCode.NOT_FOUND, {});
    } catch (error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
    }
};

export default {
    create,
    findById,
    findByUserId
}; 