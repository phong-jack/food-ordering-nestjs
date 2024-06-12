import { ApiProperty } from '@nestjs/swagger';

export class UserMetadataCreateDto {
  @ApiProperty({
    example: 'mailVerify',
    description: 'Thong tin xac thuc',
  })
  key: string;

  @ApiProperty({
    example: 'oke',
    description: 'Value of key',
  })
  value: string;

  @ApiProperty({
    example: 2,
    description: 'User id apply metadata',
  })
  userId: number;
}
