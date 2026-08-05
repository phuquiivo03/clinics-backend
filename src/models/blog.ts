import { model, Schema } from 'mongoose';
import type { Blog } from '../types';

const DOCUMENT = 'Blog';
const COLLECTION = 'Blogs';

const blogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Specialty',
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION,
  },
);

// Add indexes for faster queries
blogSchema.index({ title: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ specialties: 1 });

export default model<Blog>(DOCUMENT, blogSchema);
