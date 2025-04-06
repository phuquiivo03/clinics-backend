import type { RequestHandler } from "express";
import { consultationPackageService } from "../services";
import type { IConsultationPackageRequest } from "../dto";
import type { ObjectId } from "mongoose";
import { CustomExpress } from "../pkg/app/response";
import { ErrorCode } from "../pkg/e/code";

const create: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const consultationPackageRequest: IConsultationPackageRequest  = req.body;
        const consultationPackage = await consultationPackageService.create(consultationPackageRequest);
        if(consultationPackage) {
            appExpress.response201(consultationPackage);
        }
        throw new Error('Invalid package data');
    }catch(error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {})
    }
}

const findById: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const id = req.params.id as unknown as ObjectId;
        const consultationPackage = await consultationPackageService.findById(id);
        if(consultationPackage) {
            appExpress.response200(consultationPackage);
        }
        appExpress.response404(ErrorCode.NOT_FOUND, {})
    }catch(error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {})
    }
}

const findAll: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const consultationPackages = await consultationPackageService.findAll({selectFields: ["title", "icon"]});
        appExpress.response200(consultationPackages);
    }catch(error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {})
    }
}

export default {
    create,
    findById,
    findAll
}