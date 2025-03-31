import type { RequestHandler } from "express";
import { consultationPackageService } from "../services";
import type { IConsultationPackageRequest } from "../dto";

const create: RequestHandler = async (req, res) => {
    try {
        const consultationPackageRequest: IConsultationPackageRequest  = req.body;
        const consultationPackage = await consultationPackageService.create(consultationPackageRequest);
        if(consultationPackage) {
            res.status(201).json(consultationPackage);
        }
        throw new Error('Invalid package data');
    }catch(error) {
        res.status(401).json({ message: 'Failed to create package, Error: ' + (error as Error).message });
    }
}

const findAll: RequestHandler = async (req, res) => {
    try {
        const consultationPackages = await consultationPackageService.findAll({selectFields: ["title", "icon"]});
        res.status(200).json(consultationPackages);
    }catch(error) {
        res.status(401).json({ message: 'Server Error' });
    }
}

export default {
    create,
    findAll
}