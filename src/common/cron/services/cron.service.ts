import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FetchService } from 'src/common/fetch/services/fetch.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private fetchService: FetchService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleFetchShopData() {
    await this.fetchService.fetchShopData(1, 100);
    this.logger.debug('Called when the current ?');
  }
}
