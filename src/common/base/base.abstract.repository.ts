import {
  BaseEntity,
  DeepPartial,
  Entity,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { IBaseRepository } from './base.interface.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BadRequestException } from '@nestjs/common';

export class BaseRepositoryAbstract<T extends BaseEntity>
  implements IBaseRepository<T>
{
  protected constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    const items = await this.repository.find({});
    return items;
  }

  async findOneById(id: number): Promise<T | null> {
    return await this.repository.findOneBy({
      id: id,
    } as FindOptionsWhere<BaseEntity>);
  }

  async findOneBy(filter: object): Promise<T> {
    return await this.repository.findOneBy(filter as FindOptionsWhere<T>);
  }

  async create(dto: DeepPartial<T>): Promise<T> {
    const newItem = this.repository.create(dto);
    return await this.repository.save(newItem);
  }

  async update(id: number, dto: QueryDeepPartialEntity<T>): Promise<T> {
    await this.repository.update(id, dto);
    return await this.findOneById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAllWithPagination(
    page: number,
    limit: number,
  ): Promise<[T[], number]> {
    const [items, count] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return [items, count];
  }
}
