import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../repositories/shop.repository';
import { Shop } from '../entities/Shop';
import { ShopUpdateDto } from '../dtos/shop.update.dto';
import { ShopCreateDto } from '../dtos/shop.create.dto';
import { GeocodingService } from 'src/modules/geocoding/service/geocoding.service';
import { GeocodingReponse } from 'src/modules/geocoding/interfaces/geocoding.response';
import { LocateService } from 'src/modules/geocoding/service/locate.service';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class ShopService {
  constructor(
    private shopRepository: ShopRepository,
    private geocodingSerivce: GeocodingService,
    private locateService: LocateService,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.findAll();
  }

  async findAllWithDistance(): Promise<Shop[]> {
    return await this.shopRepository.findAllWithDistance();
  }

  async findOneById(id: number): Promise<Shop> {
    return await this.shopRepository.findOneById(id);
  }

  async updateShop(id: number, shopUpdateDto: ShopUpdateDto) {
    return await this.shopRepository.updateShop(id, shopUpdateDto);
  }

  async createShop(shopCreateDto: ShopCreateDto) {
    return await this.shopRepository.createShop(shopCreateDto);
  }

  async deleteShop(id: number) {
    await this.shopRepository.deleteShop(id);
  }

  async updateShopLocate(id: number, address: string): Promise<Shop> {
    const place: GeocodingReponse =
      await this.geocodingSerivce.findByAddress(address);
    const locate = await this.locateService.updateLocateByShop(
      id,
      place.geometry,
    );
    const shopUpdated = await this.shopRepository.updateShopLocate(
      id,
      address,
      locate.id,
    );
    return shopUpdated;
  }

  async findShopByDistance(userId: number) {
    const user = await this.userService.findById(userId);
    const place: GeocodingReponse = await this.geocodingSerivce.findByAddress(
      user.address,
    );
    console.log(place);
    const shops = await this.findAllWithDistance();

    const sortedShops = shops
      .map((shop) => {
        if (!shop.locate) return { ...shop, distance: null };
        const distance = this.geocodingSerivce.getDistanceFromLatLonInKm(
          place.geometry.lat,
          place.geometry.lng,
          shop?.locate.lat,
          shop?.locate.lng,
        );

        return { ...shop, distance };
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    return sortedShops;
  }
}
