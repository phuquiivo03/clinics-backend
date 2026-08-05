import { specialtyModel } from '../models';
import type { Specialty } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';

interface SpecialtyRepository extends BaseRepository<Specialty> {}

class SpecialtyRepositoryImpl extends BaseRepositoryImpl<Specialty> implements SpecialtyRepository {
  constructor() {
    super(specialtyModel);
  }
}

export { type SpecialtyRepository, SpecialtyRepositoryImpl };
