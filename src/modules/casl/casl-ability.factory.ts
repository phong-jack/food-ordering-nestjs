import {
  AbilityBuilder,
  AbilityClass,
  AbilityTuple,
  ConditionsMatcher,
  ExtractSubjectType,
  FieldMatcher,
  InferSubjects,
  MatchConditions,
  MongoAbility,
  MongoQuery,
  PureAbility,
  createMongoAbility,
  subject,
} from '@casl/ability';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Action } from './constants/casl.constant';
import { Shop } from '../shop/entities/shop.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { Order } from '../order/entities/order.entity';
import { OrderService } from '../order/services/order.service';
import { UserService } from '../user/services/user/user.service';
import { UserRole } from '../user/constants/user.enum';
import * as _ from 'lodash';

type AppSubjects =
  | InferSubjects<typeof Shop | typeof User | typeof Product | typeof Order>
  | 'all';

export type AppAbility = MongoAbility<[Action, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  createForShop(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, Shop);
      can(Action.Delete, Shop);
      can(Action.Manage, Product);
      can(Action.Manage, Order);
    }
    can(Action.Read, Shop);
    can(Action.Update, Shop, { id: user.shop?.id });

    can(Action.Update, Product, { shopId: user.shop?.id });
    can(Action.Delete, Product, { shopId: user.shop?.id });

    can(Action.Read, Order, { userId: user?.id });
    can(Action.Read, Order, { shipperId: user?.id });
    can(Action.Read, Order, { shopId: user.shop?.id });
    can(Action.Update, Order, { userId: user?.id });
    can(Action.Update, Order, { shipperId: user?.id });
    can(Action.Update, Order, { shopId: user.shop?.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<AppSubjects>,
    });
  }

  async createForProduct(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, Product);
    }
    console.log('Check user:: ', user);
    console.log('subject:: ', Product);

    can(Action.Create, Product);
    can(Action.Delete, Product, { shop: { id: user?.shop.id } });

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<AppSubjects>,
    });
  }

  async createForOrder(user: any, orderId: number) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const foundOrder = await this.orderService.findById(orderId);
    if (!foundOrder) {
      throw new BadRequestException('Order not found');
    }

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, Order);
    }

    //Shop
    if (user?.shopId) {
      if (foundOrder.shop.id === user?.shopId) {
        can(Action.Read, Order);
        can(Action.Update, Order);
      }
    } else {
      // user
      if (foundOrder.user.id === user.sub && user.role === UserRole.USER) {
        can(Action.Create, Order);
        can(Action.Read, Order);
        can(Action.Update, Order);
      }
      //shipper
      else if (
        user.role === UserRole.SHIPPER &&
        foundOrder?.shipper.id === user.sub
      ) {
        can(Action.Read, Order);
        can(Action.Update, Order);
      }
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<AppSubjects>,
    });
  }

  async createForUser(user: any, userId: number) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user['role'] === UserRole.ADMIN) {
      can(Action.Manage, User);
      can(Action.Delete, User);
    }

    if (user['sub'] === userId) {
      can(Action.Create, User);
      can(Action.Read, User);
      can(Action.Update, User);
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<AppSubjects>,
    });
  }
}
