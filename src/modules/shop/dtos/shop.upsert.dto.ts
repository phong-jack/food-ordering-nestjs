import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ShopUpdateDto } from './shop.update.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ShopUpsertDto extends PartialType(ShopUpdateDto) {
  @ApiProperty({
    example: 300,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  lat?: number;
  lng?: number;

  isWorking?: boolean;
}
