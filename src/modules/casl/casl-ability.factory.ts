import {
  AbilityBuilder,
  AbilityClass,
  AbilityTuple,
  ConditionsMatcher,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  MongoAbility,
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
import { Shop } from '../shop/entities/Shop';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { Order } from '../order/entities/order.entity';
import { OrderService } from '../order/services/order.service';
import { UserService } from '../user/services/user/user.service';
import { UserRole } from '../user/constants/user.enum';

type AppSubjects =
  | InferSubjects<typeof Shop | typeof User | typeof Product | typeof Order>
  | 'all';

export type AppAbility = PureAbility<[Action, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  createForShop(user: User, shopId?: number) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, Shop);
    }
    console.log('check Shop id:: ', user?.shop.id);

    can(Action.Read, Shop);
    can(Action.Update, Shop, { id: user?.shop.id });

    return build();
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
