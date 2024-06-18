import { Shop } from 'src/modules/shop/entities/Shop';
import { AppAbility } from '../../casl-ability.factory';
import { Action } from '../../constants/casl.constant';
import { IPolicyHandler } from '../../interfaces/casl.interface';

export class ShopFindDistancePolicyHanlder implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Read, Shop);
  }
}

export class ShopUpdatePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, Shop);
  }
}

export class ShopDeletePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Delete, Shop);
  }
}
