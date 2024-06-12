import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ShipperStatus } from '../constant/shipper.constant';

@ObjectType()
export class ShipperDto {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  phone: string;

  @Field((type) => ShipperStatus)
  status: ShipperStatus;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;
}
