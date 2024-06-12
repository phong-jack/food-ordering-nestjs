import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UserMetadata } from '../entities/user-metatdata.entity';
import { UserMetadataUpdateDto } from '../dtos/user-metadata.update.dto';

export class UserMetadataRepository extends BaseRepositoryAbstract<UserMetadata> {
  constructor(
    @InjectRepository(UserMetadata)
    private userMetadataRepository: Repository<UserMetadata>,
  ) {
    super(userMetadataRepository);
  }
  async findOneBy(
    filter: FindOptionsWhere<UserMetadata>,
  ): Promise<UserMetadata> {
    return await this.userMetadataRepository.findOne({
      relations: { user: true },
      where: filter,
    });
  }

  async updateBy(
    filter: FindOptionsWhere<UserMetadata>,
    dto: UserMetadataUpdateDto,
  ) {
    return await this.userMetadataRepository.update(filter, dto);
  }
}
