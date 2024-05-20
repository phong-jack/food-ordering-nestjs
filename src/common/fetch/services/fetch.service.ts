import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IFetchShop } from '../interface/fetch.request-shop.interface';
import { CITY_ID } from '../constants/fetch.shop-cities.constant';
import { Observable, catchError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { ShopService } from 'src/modules/shop/services/shop.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class FetchService {
  constructor(@InjectQueue('fetch') private readonly fetchQueue: Queue) {}

  async fetchShopData(): Promise<void> {
    let page: number = 1;
    let count: number = 100;

    const fetchOptions: IFetchShop = {
      CityId: CITY_ID.HUE,
      count: count,
      page: page,
      type: 1,
    };

    await this.fetchQueue.add('sync.shop', fetchOptions);
  }
}
