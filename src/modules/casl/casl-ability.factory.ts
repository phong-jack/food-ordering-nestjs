import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Action } from './constants/casl.constant';
import { Shop } from '../shop/entities/Shop';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { Order } from '../order/entities/order.entity';
import { OrderService } from '../order/services/order.service';

type Subjects =
  | InferSubjects<typeof Shop | typeof User | typeof Product | typeof Order>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  createForUser(user: any, shopId: number) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user?.shopId === shopId) {
      can(Action.Update, Shop);
    } else {
      can(Action.Read, Shop);
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }

  async createForProduct(user: any, productId: number) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const foundProduct = await this.productService.findById(productId);

    if (foundProduct.shop.id === user?.shopId) {
      can(Action.Update, Product);
      can(Action.Delete, Product);
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }

  async createForOrder(user: any, orderId: number) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const foundOrder = await this.orderService.findById(orderId);

    //Shop
    if (user?.shopId) {
      if (foundOrder.shop.id === user?.shopId) {
        can(Action.Update, Order);
      }
    } else {
      if (foundOrder.user.id === user.sub) {
        can(Action.Update, Order);
      }
    }
    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
