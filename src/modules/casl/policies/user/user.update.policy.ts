import { AppAbility } from '@modules/casl/casl-ability.factory';
import { Action } from '@modules/casl/constants/casl.constant';
import { IPolicyHandler } from '@modules/casl/interfaces/casl.interface';
import { User } from '@modules/user/entities/user.entity';

export class UserUpdatePolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Update, User);
  }
}
