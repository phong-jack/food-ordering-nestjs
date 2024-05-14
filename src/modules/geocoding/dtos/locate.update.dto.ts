import { PartialType } from '@nestjs/swagger';
import { LocateCreateDto } from './locate.create.dto';

export class LocateUpdateDto extends PartialType(LocateCreateDto) {}
