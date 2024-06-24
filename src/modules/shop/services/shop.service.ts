import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ShopRepository } from '../repositories/shop.repository';
import { Shop } from '../entities/shop.entity';
import { ShopUpdateDto } from '../dtos/shop.update.dto';
import { ShopCreateDto } from '../dtos/shop.create.dto';
import { GeocodingService } from 'src/modules/geocoding/service/geocoding.service';
import {
  GeocodingReponse,
  Geometry,
} from 'src/modules/geocoding/interfaces/geocoding.response';
import { LocateService } from 'src/modules/geocoding/service/locate.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { ShopUpsertDto } from '../dtos/shop.upsert.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { subject } from '@casl/ability';
import { Order } from 'src/modules/order/entities/order.entity';
import { PaginateDto } from '../dtos/paginate.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { ShopSearchDto } from '../dtos/shop.search.dto';

@Injectable()
export class ShopService {
  constructor(
    private shopRepository: ShopRepository,
    private geocodingSerivce: GeocodingService,
    private locateService: LocateService,
    private userService: UserService,
    @InjectQueue('shop')
    private shopQueue: Queue,
  ) {}

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.findAll();
  }

  async findOneById(id: number): Promise<Shop> {
    return await this.shopRepository.findOneById(id);
  }

  async updateShop(
    id: number,
    shopUpdateDto: ShopUpdateDto,
    abilities: AppAbility,
  ) {
    const shop = await this.findOneById(id);

    if (!abilities?.can(Action.Update, subject('Shop', shop))) {
      throw new ForbiddenException(
        'You do not have permission to update this information because you do not own this shop.',
      );
    }

    if (shop.address !== shopUpdateDto.address) {
      await this.updateShopLocate(id, shopUpdateDto.address);
    }
    const updatedShop = await this.shopRepository.update(id, shopUpdateDto);
    return updatedShop;
  }

  async createShop(shopCreateDto: ShopCreateDto) {
    return await this.shopRepository.create(shopCreateDto);
  }

  async deleteShop(id: number) {
    await this.shopRepository.delete(id);
  }

  async updateShopLocate(id: number, address: string): Promise<Shop> {
    const place: GeocodingReponse =
      await this.geocodingSerivce.findByAddress(address);
    const locate = await this.locateService.updateLocateByShop(
      id,
      place.geometry,
    );

    if (!locate) {
      throw new BadRequestException('Locate can not null');
    }

    const shopUpdated = await this.shopRepository.updateShopLocate(
      id,
      address,
      locate.id,
    );
    return shopUpdated;
  }

  async findShopByDistance(userId: number, page: number, limit: number) {
    const user = await this.userService.findById(userId);
    const place: GeocodingReponse = await this.geocodingSerivce.findByAddress(
      user.address,
    );
    const userLocate = place.geometry;
    const [shops, count] = await this.shopRepository.findAllByDistance(
      userLocate,
      page,
      limit,
    );

    return {
      shops,
      count,
    };
  }

  async upsert(shopUpsertDto: ShopUpsertDto) {
    const upsertedShop = await this.shopRepository.upsert(shopUpsertDto);
    return upsertedShop;
  }

  // async upsertShop(shopUpsertDto: ShopUpsertDto): Promise<Shop> {
  //   const upsertedShop = await this.shopRepository.upsertShop(shopUpsertDto);
  //   const locate = await this.locateService.updateLocateByShop(
  //     shopUpsertDto.id,
  //     { lat: shopUpsertDto.lat, lng: shopUpsertDto.lng },
  //   );
  //   await this.shopRepository.updateShopLocate(
  //     shopUpsertDto.id,
  //     shopUpsertDto.address,
  //     locate?.id,
  //   );
  //   return upsertedShop;
  // }

  async upsertShop(shopUpsertDto: ShopUpsertDto) {
    await this.shopQueue.add('shop-upsert', shopUpsertDto, { delay: 1000 });

    return;
  }

  async searchShopWithProduct(shopSearchDto: ShopSearchDto) {
    return await this.shopRepository.searchShopWithProduct(shopSearchDto);
  }

  async filterShopWithCategory(
    categoryIds: string[],
    paginationDto: PaginationDto,
  ) {
    return await this.shopRepository.filterShopWithCategory(
      categoryIds,
      paginationDto,
    );
  }
}
