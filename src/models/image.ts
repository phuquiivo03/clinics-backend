import { model, Schema } from 'mongoose';
import type { Doctor, Image } from '../types';

const DOCUMENT = 'Image';
const COLLECTION = 'Images';

const imageSchema = new Schema<Image>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Image>(DOCUMENT, imageSchema, COLLECTION);
