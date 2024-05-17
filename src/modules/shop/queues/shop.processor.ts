import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ShopService } from '../services/shop.service';
import { ShopUpsertDto } from '../dtos/shop.upsert.dto';
import { LocateService } from 'src/modules/geocoding/service/locate.service';

@Processor('shop', {
  concurrency: 1,
})
export class ShopProcessor extends WorkerHost {
  private logger = new Logger();

  constructor(
    private shopService: ShopService,
    private locateService: LocateService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    const shopUpsertDto: ShopUpsertDto = job.data as ShopUpsertDto;
    switch (job.name) {
      case 'shop-upsert':
        return await this.upsertShop(shopUpsertDto);
      default:
        throw new Error('No job name match');
    }
  }

  async upsertShop(shopUpsertDto: ShopUpsertDto) {
    this.logger.log(`upserting shop... `);

    await this.shopService.upsert(shopUpsertDto);
    await this.shopService.updateShopLocate(
      shopUpsertDto.id,
      shopUpsertDto.address,
    );
  }
}
