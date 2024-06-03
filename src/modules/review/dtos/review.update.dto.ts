import { OmitType, PickType } from '@nestjs/swagger';
import { ReviewCreateDto } from './review.create.dto';

export class ReviewUpdateDto extends PickType(ReviewCreateDto, [
  'rating',
  'content',
] as const) {}
