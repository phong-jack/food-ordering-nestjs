import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class PromotionCreateDto {
  @IsDateString()
  @IsNotEmpty()
  dayStart: string;

  @Matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'timeStart must be in HH:mm format',
  })
  timeStart: string;

  @IsNumber()
  @IsNotEmpty()
  durationHours: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  promotionCategoryId: number[];

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
