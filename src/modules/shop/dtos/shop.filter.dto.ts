import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { PaginateDto } from './paginate.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShopFilterDto {
  @IsNotEmpty()
  @IsString()
  categories: string;
}
