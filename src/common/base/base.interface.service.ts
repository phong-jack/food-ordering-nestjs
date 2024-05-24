import { DeepPartial } from 'typeorm';

export interface IBaseService<T> {
  findAll(): Promise<T[]>;

  findOneById(id: number): Promise<T>;

  findOneBy(filter: object): Promise<T>;

  create(dto: DeepPartial<T>): Promise<T>;

  update(id: number, item: Partial<T>): Promise<T>;

  delete(id: number): Promise<void>;

  findAllWithPagination(page: number, limit: number): Promise<[T[], number]>;
}
