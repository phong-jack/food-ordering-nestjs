import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import {
  IFetchShop,
  IShopResponse,
} from '../interface/fetch.request-shop.interface';
import { ShopService } from 'src/modules/shop/services/shop.service';
import { HttpService } from '@nestjs/axios';

@Processor('fetch', {
  concurrency: 1,
})
export class FetchProcessor extends WorkerHost {
  private logger = new Logger();
  constructor(
    private readonly httpService: HttpService,
    private readonly shopService: ShopService,
    @InjectQueue('fetch') private readonly fetchQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    const fetchOptions: IFetchShop = job.data as IFetchShop;
    switch (job.name) {
      case 'sync.shop':
        return await this.syncQueueJob(fetchOptions);
      default:
        throw new Error('No job name match');
    }
  }

  async syncQueueJob(fetchOptions: IFetchShop) {
    this.logger.log(`Sync queue syncing `);
    console.log('Before fetch: ', fetchOptions);
    const response = await this.fetchShopData(fetchOptions);
    await this.upsertShopData(response.data.Items as IShopResponse[]);
    if (fetchOptions.page * fetchOptions.count < response.data.Total) {
      await this.fetchQueue.add('sync.shop', {
        ...fetchOptions,
        page: fetchOptions.page + 1,
      } as IFetchShop);
      console.log('Page:: ', fetchOptions.page);
      console.log('Data fetch:: ', fetchOptions.page * fetchOptions.count);
      console.log('Fetch total: ', response.data.Total);
    }
  }

  async fetchShopData(fetchOptions: IFetchShop) {
    const url = new URL('https://www.foody.vn/__get/Place/HomeListPlace');
    url.searchParams.set('page', fetchOptions.page.toString());
    url.searchParams.set('count', fetchOptions.count.toString());
    url.searchParams.set('type', fetchOptions.type.toString());
    url.searchParams.set('CityId', fetchOptions.CityId.toString());

    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: 'flg=vn; floc=218',
    };

    const response = await this.httpService.axiosRef.get(url.toString(), {
      headers: headers,
    });
    return response;
  }

  async upsertShopData(shops: IShopResponse[]) {
    shops.map(async (shop) => {
      await this.shopService.upsertShop({
        id: shop.Id,
        name: shop.Name,
        address: shop.Address,
        image: shop.PhotoUrl,
        isWorking: Boolean(shop.RestaurantStatus),
        phone: shop.Phone,
        lat: shop?.Latitude,
        lng: shop?.Longitude,
      });
    });
  }
}
