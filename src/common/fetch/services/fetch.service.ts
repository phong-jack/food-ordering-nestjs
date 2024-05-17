import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  IFetchShop,
  IShopResonse,
} from '../interface/fetch.request-shop.interface';
import { CITY_ID } from '../constants/fetch.shop-cities.constant';
import { Observable, catchError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { ShopService } from 'src/modules/shop/services/shop.service';

@Injectable()
export class FetchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly shopService: ShopService,
  ) {}

  async fetchShopData(
    page: number = 1,
    count: number = 100,
  ): Promise<AxiosResponse<any>> {
    const limit = 20; // items count when fetching
    let currentPage = page;
    let fetchedItems = 0;

    const fetchOptions: IFetchShop = {
      CityId: CITY_ID.HUE,
      count: count,
      page: page,
      type: 1,
    };

    while (fetchedItems < count) {
      const url = `https://www.foody.vn/__get/Place/HomeListPlace?page=${fetchOptions.page}&count=${fetchOptions.count}&type=${fetchOptions.type}&CityId=${fetchOptions.CityId}`;
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: 'flg=vn; floc=218',
      };

      const response = await this.httpService.axiosRef.get(url, {
        headers: headers,
      });
      await this.upsertShopData(response.data.Items as IShopResonse[]);
      return response.data.Items;
    }
  }

  async upsertShopData(shops: IShopResonse[]) {
    shops.map(async (shop) => {
      const upsertShop = await this.shopService.upsertShop({
        id: shop.Id,
        name: shop.Name,
        address: shop.Address,
        image: shop.PhotoUrl,
        isWorking: Boolean(0),
        phone: shop.Phone,
        lat: shop.Latitude,
        lng: shop.Longitude,
      });
    });
  }
}
