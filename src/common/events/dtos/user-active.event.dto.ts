import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserActiveEventDto {
  @IsString()
  @IsNotEmpty()
  typeActive: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  constructor(typeActive: string, userId: number) {
    this.typeActive = typeActive;
    this.userId = userId;
  }
}
