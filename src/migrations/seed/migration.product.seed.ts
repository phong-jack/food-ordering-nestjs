import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { CATEGORY_ID } from 'src/modules/product/constants/category.constant';
import { Product } from 'src/modules/product/entities/product.entity';
import { ProductService } from 'src/modules/product/services/product.service';

@Injectable()
export class MigrationProductSeed {
  constructor(private productService: ProductService) {}

  @Command({
    command: 'seed:product',
    describe: 'seed products',
  })
  async seed(): Promise<void> {
    const product1: Promise<Product> = this.productService.createProduct({
      categoryId: CATEGORY_ID.DRINK,
      name: 'Trà Sữa Khúc Bạch Thạch Phô Mai',
      description:
        'Trà sữa béo thơm kèm trân châu, jelly, khúc bạch và thạch phô mai',
      image:
        'https://mms.img.susercontent.com/vn-11134517-7r98o-lqygn9xqlcih21@resize_ss120x120!@crop_w120_h120_cT',
      price: 29000,
      shopId: 1000012108,
    });
    const product2: Promise<Product> = this.productService.createProduct({
      categoryId: CATEGORY_ID.DRINK,
      name: 'Trà Sữa Thái Xanh TCDD Kem Trứng Nướng',
      description:
        'Trà sữa béo thơm, ít ngọt kết hợp cùng kem trứng cháy ngon lắm bạn ơi!',
      image:
        'https://mms.img.susercontent.com/vn-11134517-7r98o-lr3fvv5hlnrtc4@resize_ss120x120!@crop_w120_h120_cT',
      price: 32000,
      shopId: 1000012108,
    });
    const product3: Promise<Product> = this.productService.createProduct({
      categoryId: CATEGORY_ID.DRINK,
      name: 'Sữa Tươi Trân Châu Đường Đen',
      description:
        'Hương vị thanh mát nhẹ nhàng của sữa tươi hoà quyện với trân châu đường đen dẻo dai, ngọt thơm',
      image:
        'https://mms.img.susercontent.com/vn-11134517-7r98o-lqy0m6sii2tg20@resize_ss120x120!@crop_w120_h120_cT',
      price: 29000,
      shopId: 1000012108,
    });

    try {
      await Promise.all([product1, product2, product3]);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
