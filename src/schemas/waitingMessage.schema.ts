import { z } from 'zod';
import { WaitingMessageStatus } from '../types/waitingMessage';

// Schema for creating a waiting message
export const createWaitingMessageSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z.string().min(1, 'Message is required'),
  status: z.enum([
    WaitingMessageStatus.PENDING,
    WaitingMessageStatus.READ,
    WaitingMessageStatus.DELETED
  ], {
    message: 'Status must be either "pending", "read", or "deleted"'
  }).default(WaitingMessageStatus.PENDING),
  triggerAt: z.string().min(1, 'Trigger time is required'),
});

// Schema for updating a waiting message
export const updateWaitingMessageSchema = z.object({
  status: z.enum([
    WaitingMessageStatus.PENDING,
    WaitingMessageStatus.READ,
    WaitingMessageStatus.DELETED
  ], {
    message: 'Status must be either "pending", "read", or "deleted"'
  }),
});

// Schema for finding a waiting message by ID
export const findWaitingMessageByIdSchema = z.object({
  id: z.string().min(1, 'Waiting message ID is required'),
}); 