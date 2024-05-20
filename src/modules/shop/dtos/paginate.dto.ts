import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginateDto {
  @ApiProperty({ required: false, default: 1 })
  @IsInt()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsInt()
  @IsOptional()
  limit: number = 10;
}
