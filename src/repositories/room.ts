import { roomModel } from "../models";
import type { Room } from "../types/room";
import { BaseRepositoryImpl, type BaseRepository } from "./base";

interface RoomRepository extends BaseRepository<Room> {}

class RoomRepositoryImpl extends BaseRepositoryImpl<Room> implements RoomRepository {
    constructor() {
        super(roomModel);
    }
}

export default new RoomRepositoryImpl(); 