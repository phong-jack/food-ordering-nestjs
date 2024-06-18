import { Product } from 'src/modules/product/entities/product.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action } from '../../constants/casl.constant';
import { IPolicyHandler } from '../../interfaces/casl.interface';

export class ProductUpdatePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Update, Product);
  }
}
