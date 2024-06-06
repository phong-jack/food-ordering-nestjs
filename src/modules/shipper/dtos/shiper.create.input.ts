import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ShipperStatus } from '../constant/shipper.constant';

@InputType()
export class ShipperCreateInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;
}
