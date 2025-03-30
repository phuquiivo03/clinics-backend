import {  model, Schema } from 'mongoose';
import type { ConsultationPackage } from '../types';


const DOCUMENT = "ConsultationPackage";
const COLLECTION = "ConsultationPackages";

const consultationPackageSchema = new Schema<ConsultationPackage>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: 'ConsultationService',
            },
        ],
        
    },
    {
        timestamps: true,
    }
);

export default model<ConsultationPackage>(DOCUMENT, consultationPackageSchema, COLLECTION);