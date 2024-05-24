import { BaseEntity, DeepPartial } from 'typeorm';
import { IBaseRepository } from './base.interface.repository';
import { IBaseService } from './base.interface.service';
import { Inject } from '@nestjs/common';

export class BaseServiceAbstract<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(private readonly repository: IBaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repository.findAll();
  }

  async findOneById(id: number): Promise<T> {
    return await this.repository.findOneById(id);
  }

  async findOneBy(filter: object): Promise<T> {
    return this.repository.findOneBy(filter);
  }

  async create(dto: DeepPartial<T>): Promise<T> {
    return this.repository.create(dto);
  }

  async update(id: number, item: Partial<T>): Promise<T> {
    return this.repository.update(id, item);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAllWithPagination(
    page: number,
    limit: number,
  ): Promise<[T[], number]> {
    return this.repository.findAllWithPagination(page, limit);
  }
}
