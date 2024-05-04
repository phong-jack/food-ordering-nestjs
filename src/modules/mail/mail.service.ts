import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3000/api/auth/active?token=` + token;
    try {
      const res = await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to User Managerment App! Confirm your email!',
        template: './confirmation',
        context: {
          name: `${user.firstName} ${user.lastName}`,
          url,
        },
      });
      console.log(res);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
