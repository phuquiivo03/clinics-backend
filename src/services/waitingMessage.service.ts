import type { ObjectId } from 'mongoose';
import waitingMessageRepository from '../repositories/waitingMessage';
import type { WaitingMessage } from '../types/waitingMessage';
import type { MongooseFindManyOptions } from '../repositories/type';

class WaitingMessageService {
  async create(data: Omit<WaitingMessage, '_id'>): Promise<WaitingMessage> {
    const message = await waitingMessageRepository.create(data);
    return message as unknown as WaitingMessage;
  }

  async findById(id: ObjectId): Promise<WaitingMessage | null> {
    const message = await waitingMessageRepository.findById(id);
    return message as unknown as WaitingMessage;
  }

  async findMany(options: MongooseFindManyOptions = {}): Promise<any> {
    const messages = await waitingMessageRepository.findMany(options);
    return messages;
  }

  async update(
    id: ObjectId,
    data: Partial<Omit<WaitingMessage, '_id'>>
  ): Promise<WaitingMessage | null> {
    const message = await waitingMessageRepository.update(id, data);
    return message as unknown as WaitingMessage;
  }

  async delete(id: ObjectId): Promise<WaitingMessage | null> {
    const message = await waitingMessageRepository.delete(id);
    return message as unknown as WaitingMessage;
  }
}

export default new WaitingMessageService(); 