import { waitingMessageModel } from '../models';
import type { WaitingMessage } from '../types/waitingMessage';
import { BaseRepositoryImpl, type BaseRepository } from './base';

interface WaitingMessageRepository extends BaseRepository<WaitingMessage> {}

class WaitingMessageRepositoryImpl
  extends BaseRepositoryImpl<WaitingMessage>
  implements WaitingMessageRepository
{
  constructor() {
    super(waitingMessageModel);
  }
}

export { type WaitingMessageRepository, WaitingMessageRepositoryImpl };
export default new WaitingMessageRepositoryImpl();