import type { RequestHandler } from "express";
import { consultationServiceService } from "../services";
import type { IConsultationServiceRequest } from "../dto";

const create: RequestHandler = async (req, res) => {
    try {
        const consultationServiceRequest: IConsultationServiceRequest  = req.body;
        const consultationPackage = await consultationServiceService.create(consultationServiceRequest);
        if(consultationPackage) {
            res.status(201).json(consultationPackage);
        }
        throw new Error('Invalid package data');
    }catch(error) {
        res.status(401).json({ message: (error as Error).message });
    }
}

const createMany: RequestHandler = async (req, res) => {
    try {
        const consultationServiceRequest: IConsultationServiceRequest[]  = req.body;
        const consultationPackage = await consultationServiceService.createMany(consultationServiceRequest);
        if(consultationPackage) {
            res.status(201).json(consultationPackage);
        }
        throw new Error('Invalid package data');
    }catch(error) {
        res.status(401).json({ message: (error as Error).message });
    }
}

const findAll: RequestHandler = async (req, res) => {
    try {
        const consultationPackages = await consultationServiceService.findAll();
        res.status(200).json(consultationPackages);
    }catch(error) {
        res.status(401).json({ message: (error as Error).message });
    }
}

export default {
    create,
    createMany,
    findAll
}