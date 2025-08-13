import mongoose from 'mongoose';
import { WaitingMessageStatus, type WaitingMessage } from '../types/waitingMessage';

const waitingMessageSchema = new mongoose.Schema<WaitingMessage>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(WaitingMessageStatus),
      default: WaitingMessageStatus.PENDING,
    },
    triggerAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<WaitingMessage>('WaitingMessage', waitingMessageSchema);
