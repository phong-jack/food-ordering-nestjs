import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LocateUpdateDto } from 'src/modules/geocoding/dtos/locate.update.dto';

export class ShopLocateUpdateDto {
  @ApiProperty({
    example: '27 Lý Thường Kiệt',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
