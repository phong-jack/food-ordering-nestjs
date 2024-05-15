import { DeepPartial } from 'typeorm';

export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;

  findOneById(id: number): Promise<T | null>;

  findOneBy(filter: object): Promise<T>;

  create(dto: DeepPartial<T>): Promise<T>;

  update(id: number, dto: any): Promise<T>;

  delete(id: number): Promise<void>;

  findAllWithPagination(page: number, limit: number): Promise<[T[], number]>;
}
