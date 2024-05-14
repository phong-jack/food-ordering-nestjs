import { IsNotEmpty, IsNumber } from 'class-validator';

export class LocateCreateDto {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsNotEmpty()
  @IsNumber()
  shopId: number;
}
