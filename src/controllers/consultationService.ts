import type { RequestHandler } from "express";
import { consultationServiceService } from "../services";
import type { IConsultationServiceRequest } from "../dto";
import { CustomExpress } from "../pkg/app/response";
import { ErrorCode } from "../pkg/e/code";

const create: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const consultationServiceRequest: IConsultationServiceRequest  = req.body;
        const consultationPackage = await consultationServiceService.create(consultationServiceRequest);
        if(consultationPackage) {
            appExpress.response201(consultationPackage);
        }
        throw new Error('Invalid package data');
    }catch(error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
    }
}

const createMany: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const consultationServiceRequest: IConsultationServiceRequest[]  = req.body;
        const consultationPackage = await consultationServiceService.createMany(consultationServiceRequest);
        if(consultationPackage) {
            appExpress.response201(consultationPackage);
        }
        throw new Error('Invalid package data');
    }catch(error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
    }
}

const findAll: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const consultationPackages = await consultationServiceService.findAll();
        appExpress.response200(consultationPackages);
    }catch(error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
    }
}

export default {
    create,
    createMany,
    findAll
}