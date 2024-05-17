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

  async fetchShopData(): Promise<void> {
    let page: number = 1;
    let count: number = 100;
    let fetchedItems: number = 0;

    const fetchOptions: IFetchShop = {
      CityId: CITY_ID.HUE,
      count: count,
      page: page,
      type: 1,
    };

    while (true) {
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
      await this.upsertShopData(response.data.Items as IShopResonse[]);

      fetchedItems = fetchedItems + response.data.Items.length;
      fetchOptions.page++;
      console.log(fetchOptions.page);
      if (fetchedItems >= response.data.Total) {
        console.log('Check items page:: ', fetchedItems);
        console.log('Check opion page:: ', response.data.Total);
        break;
      }
    }
  }

  async upsertShopData(shops: IShopResonse[]) {
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
