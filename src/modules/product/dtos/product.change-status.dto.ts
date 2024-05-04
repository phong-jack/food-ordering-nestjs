import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ProductChangeStatusDto {
  @ApiProperty({ example: true, description: 'The status of product' })
  @IsBoolean()
  isAlready: boolean;
}
