import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdateDto {
  @ApiProperty({
    example: 'Gà kiến nướng nguyên con',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Món gà cực ngon',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: '20000', required: false })
  price: number;
}
