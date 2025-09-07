import type { ICD } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import icdModel from '../models/icd';

interface ICDRepository extends BaseRepository<ICD> {}

class ICDRepositoryImpl
  extends BaseRepositoryImpl<ICD>
  implements ICDRepository
{
  constructor() {
    super(icdModel);
  }
}

export { type ICDRepository, ICDRepositoryImpl };