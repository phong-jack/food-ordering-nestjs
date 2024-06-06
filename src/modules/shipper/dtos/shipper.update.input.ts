import { PartialType } from '@nestjs/swagger';
import { ShipperCreateInput } from './shiper.create.input';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ShipperStatus } from '../constant/shipper.constant';

@InputType()
export class ShipperUpdateInput extends PartialType(ShipperCreateInput) {
  @Field({ nullable: true })
  @IsOptional()
  status?: ShipperStatus;
}
