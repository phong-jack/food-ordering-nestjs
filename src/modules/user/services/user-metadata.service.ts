import { Injectable } from '@nestjs/common';
import { UserMetadataRepository } from '../repositories/user-metadata.repository';
import { FindOptionsWhere } from 'typeorm';
import { UserMetadataCreateDto } from '../dtos/user-metadata.create.dto';
import { UserMetadata } from '../entities/user-metatdata.entity';
import { UserMetadataUpdateDto } from '../dtos/user-metadata.update.dto';

@Injectable()
export class UserMetadataService {
  constructor(private userMetadataRepository: UserMetadataRepository) {}

  async findAll() {
    return await this.userMetadataRepository.findAll();
  }

  async findOneById(id: number) {
    return await this.userMetadataRepository.findOneById(id);
  }

  async findOneBy(filter: FindOptionsWhere<UserMetadata>) {
    return await this.userMetadataRepository.findOneBy(filter);
  }

  async create(dto: UserMetadataCreateDto) {
    return await this.userMetadataRepository.create({
      ...dto,
      user: { id: dto.userId },
    });
  }

  async update(id: number, dto: UserMetadataUpdateDto) {
    return await this.userMetadataRepository.update(id, dto);
  }

  async updateBy(
    filter: FindOptionsWhere<UserMetadata>,
    dto: UserMetadataUpdateDto,
  ) {
    return await this.userMetadataRepository.updateBy(filter, dto);
  }

  async delete(id: number) {
    return await this.userMetadataRepository.delete(id);
  }
}
