import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class SendMailDto {
  @IsNotEmptyObject()
  @Type(() => User)
  user: User;

  @IsString()
  @IsNotEmpty()
  token: string;
}
