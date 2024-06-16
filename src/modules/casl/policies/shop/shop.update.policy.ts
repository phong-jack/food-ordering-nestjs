import { Shop } from 'src/modules/shop/entities/Shop';
import { AppAbility } from '../../casl-ability.factory';
import { Action } from '../../constants/casl.constant';
import { IPolicyHandler } from '../../interfaces/casl.interface';

export class ShopUpdatePolicyHanlder implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, Shop);
  }
}
