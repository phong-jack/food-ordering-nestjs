import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from '../entities/Shop';
import { FindManyOptions, Repository } from 'typeorm';
import { ShopCreateDto } from '../dtos/shop.create.dto';
import { ShopUpdateDto } from '../dtos/shop.update.dto';
import { BadRequestException } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';
import { Geometry } from 'src/modules/geocoding/interfaces/geocoding.response';
import { ShopUpsertDto } from '../dtos/shop.upsert.dto';

export class ShopRepository extends BaseRepositoryAbstract<Shop> {
  constructor(
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
  ) {
    super(shopRepository);
  }

  async findAllByDistance(
    userLocate: Geometry,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Shop[], number]> {
    const query = this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.locate', 'locate')
      .addSelect(
        `(
      6371 * acos(
        cos(radians(:userLatitude)) *
        cos(radians(locate.lat)) *
        cos(radians(locate.lng) - radians(:userLongitude)) +
        sin(radians(:userLatitude)) *
        sin(radians(locate.lat))
      )
    )`,
        'distance',
      )
      .setParameters({
        userLatitude: userLocate.lat,
        userLongitude: userLocate.lng,
      })
      .where('locate.lat IS NOT NULL AND locate.lng IS NOT NULL')
      .orderBy('distance', 'ASC')
      .take(limit)
      .skip((page - 1) * limit);

    const [shops, count] = await query.getManyAndCount();
    console.log('CHECK: SHOP:: ', shops);
    shops.forEach((shop) => {
      console.log(
        `Shop ID: ${shop.id}, Quan:: ${shop.name} , dia chi::  ${shop.address}, Distance: ${shop['distance']}`,
      );
    });

    return [shops, count];
  }

  async updateShopLocate(id: number, address: string, locateId: number) {
    const shop = await this.findOneById(id);
    if (!shop) throw new BadRequestException('Shop not found!');
    await this.shopRepository.save({
      id,
      address: address,
      locate: { id: locateId },
    });
    return await this.shopRepository.findOne({
      relations: { locate: true },
      where: { id: id },
    });
  }

  async upsert(shopUpsertDto: ShopUpsertDto): Promise<Shop> {
    const upsert = await this.shopRepository.upsert(shopUpsertDto, ['id']);
    const id = upsert.identifiers[0]?.id;
    if (!id) throw new Error('Error upsert shop ');
    const shopUpseted = await this.findOneById(id);
    return shopUpseted;
  }
}
