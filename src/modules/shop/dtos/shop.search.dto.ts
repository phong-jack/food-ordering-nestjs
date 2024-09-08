import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

export class ShopSearchDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;
}
