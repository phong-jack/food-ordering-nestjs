import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotificationToken } from '../entities/notification-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class NotificationTokenRepository extends BaseRepositoryAbstract<NotificationToken> {
  constructor(
    @InjectRepository(NotificationToken)
    private notificationTokenRepository: Repository<NotificationToken>,
  ) {
    super(notificationTokenRepository);
  }

  async findBy(
    filter: FindOptionsWhere<NotificationToken>,
  ): Promise<NotificationToken[]> {
    const notificationTokens = await this.notificationTokenRepository.find({
      relations: { user: true },
      where: filter,
    });
    console.log('Check noti token:: ', notificationTokens);
    return notificationTokens;
  }

  async findOneBy(
    filter: FindOptionsWhere<NotificationToken>,
  ): Promise<NotificationToken> {
    return await this.notificationTokenRepository.findOne({
      relations: { user: true },
      where: filter,
    });
  }
}
