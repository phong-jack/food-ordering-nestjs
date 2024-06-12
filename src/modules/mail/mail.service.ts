import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { SendMailOptions } from 'nodemailer';
import { SendMailDto } from './dtos/mail.send-mail.dto';
import { UserRole } from '../user/constants/user.enum';

@Injectable()
export class MailService {
  private mailSendDomain: string;
  constructor(private mailerService: MailerService) {
    this.mailSendDomain = `http://${process.env.APP_HOST}:${process.env.APP_PORT}`;
  }

  async sendRegisterMail(sendMailDto: SendMailDto) {
    const { user } = sendMailDto;

    switch (user.role) {
      case UserRole.USER:
        return await this.sendUserConfirmation(sendMailDto);
      case UserRole.SHOP:
        return await this.sendUserConfirmation(sendMailDto);
      case UserRole.SHIPPER:
        return await this.sendShipperConfirmation(sendMailDto);
      default:
        throw new BadRequestException('Not valid role for send mail');
    }
  }

  async sendUserConfirmation(sendMailDto: SendMailDto) {
    const { user, token } = sendMailDto;

    const url = new URL(this.mailSendDomain + '/api/v1/auth/active');
    url.searchParams.set('token', token);
    url.searchParams.set('typeActive', 'email');

    const sendMailOptions: ISendMailOptions = {
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to my app',
      template: './confirmation',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    };

    await this.sendMail(sendMailOptions);
  }

  async sendShipperConfirmation(sendMailDto: SendMailDto) {
    const { user, token } = sendMailDto;

    const url = new URL(this.mailSendDomain + '/api/v1/auth/active');
    url.searchParams.set('token', token);
    url.searchParams.set('typeActive', 'email');

    const sendMailOptions: ISendMailOptions = {
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'You apply for shipper role in my app',
      template: './shipper-comfirmation',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    };

    await this.sendMail(sendMailOptions);
  }

  async sendForgotPasswordRequest(sendMailDto: SendMailDto) {
    const { user, token } = sendMailDto;

    const url = new URL(this.mailSendDomain + '/api/v1/auth/forgot-password');
    url.searchParams.set('token', token);

    const sendMailOptions: ISendMailOptions = {
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'You sended forgort password request',
      template: './forgot-password',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    };

    await this.sendMail(sendMailOptions);
  }

  private async sendMail(sendMailOptions: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(sendMailOptions);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
