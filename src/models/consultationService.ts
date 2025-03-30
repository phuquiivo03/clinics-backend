import { model, Schema } from 'mongoose';
import type { ConsultationService } from '../types';

const DOCUMENT = "ConsultationService";
const COLLECTION = "ConsultationServices";

const consultationServiceSchema = new Schema<ConsultationService>(
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
        }
        
    },
    {
        timestamps: true,
    }
);

export default model<ConsultationService>(DOCUMENT, consultationServiceSchema, COLLECTION);