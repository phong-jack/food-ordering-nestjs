import { PartialType } from '@nestjs/swagger';
import { UserCreatedEventDto } from './user-create.event.dto';
import { SendMailDto } from 'src/modules/mail/dtos/mail.send-mail.dto';

export class UserRequestVerifyEventDto extends PartialType(
  UserCreatedEventDto,
) {
  constructor(sendMailDto: SendMailDto) {
    super();
    this.sendMailDto = sendMailDto;
  }
}
