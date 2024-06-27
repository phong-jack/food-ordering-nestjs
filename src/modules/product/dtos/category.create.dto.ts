import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryCreateDto {
  @ApiProperty({
    example: 'Gà',
    description: 'Create new category',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
