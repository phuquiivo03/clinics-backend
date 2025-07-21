import { type ObjectId } from "mongoose";

export type WaitingMessage = {
    _id?: ObjectId;
    userId: ObjectId;
    message: string;
    status: WaitingMessageStatus;
    triggerAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum WaitingMessageStatus {
    PENDING = 'pending',
    READ = 'read',
    DELETED = 'deleted',
}