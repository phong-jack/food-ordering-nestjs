import { PartialType } from '@nestjs/swagger';
import { UserMetadataCreateDto } from './user-metadata.create.dto';

export class UserMetadataUpdateDto extends PartialType(UserMetadataCreateDto) {}
