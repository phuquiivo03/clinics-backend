import type { ObjectId } from "mongoose";

export interface Room {
    _id?: ObjectId,
    name: string,
    roomNumber: number,
    roomFloor: number
}