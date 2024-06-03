import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewCreateDto {
  @ApiProperty({
    example: 5,
    required: true,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  rating: number;

  @ApiProperty({
    example: 'Món quán ngon quá!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  shopId: number;
}
