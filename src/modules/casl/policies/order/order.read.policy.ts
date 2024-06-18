import { Order } from 'src/modules/order/entities/order.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action } from '../../constants/casl.constant';
import { IPolicyHandler } from '../../interfaces/casl.interface';

export class OrderReadPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Read, Order);
  }
}
