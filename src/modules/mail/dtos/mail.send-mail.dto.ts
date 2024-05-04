import { User } from 'src/modules/user/entities/user.entity';

export class SendMailDto {
  user: User;
  token: string;
}
