import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserService } from 'src/modules/user/services/user/user.service';
import argon2, { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dtos/auth.sign-in.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { SendMailDto } from 'src/modules/mail/dtos/mail.send-mail.dto';
import { ChangePasswordDto } from '../dtos/auth.change-password.dto';
import { ForgotPasswordDto } from '../dtos/auth.forgot-password.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SETTING_KEY } from 'src/modules/setting/constants/setting.constant';
import { SettingCreateDto } from 'src/modules/setting/dtos/setting.create.dto';
import { UserCreatedEventDto } from 'src/common/events/dtos/user-create.event.dto';
import { USER_EVENTS } from 'src/common/events/constants/events.user.constant';
import { UserActiveEventDto } from 'src/common/events/dtos/user-active.event.dto';
import { UserMetadataService } from 'src/modules/user/services/user-metadata.service';
import { isEmail } from 'class-validator';
import { UserRequestVerifyEventDto } from 'src/common/events/dtos/user-requestVerify.event.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private eventEmitter: EventEmitter2,
    private userMetadataService: UserMetadataService,
  ) {}

  async signUp(userCreateDto: UserCreateDto) {
    const userExist = await this.userService.findOneByUserName(
      userCreateDto.username,
    );
    if (userExist) {
      throw new BadRequestException('This username already exist');
    }
    const hashPassword = await this.hashData(userCreateDto.password);
    const newUser = await this.userService.create({
      ...userCreateDto,
      password: hashPassword,
    });

    const mailToken = await this.getMailToken(newUser.id, newUser.username);
    const sendMailDto: SendMailDto = { user: newUser, token: mailToken };

    const settingCreateDto: SettingCreateDto = {
      key: SETTING_KEY.LANGUAGE,
      value: 'en',
      userId: newUser.id,
    };

    this.eventEmitter.emit(
      USER_EVENTS.REGISTERED,
      new UserCreatedEventDto(sendMailDto, settingCreateDto),
    );

    return newUser;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByUserName(signInDto.username);
    if (!user) throw new BadRequestException("This user doesn't exist!");

    const passwordMatches = await argon2.verify(
      user.password,
      signInDto.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect!');

    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.role,
      user.shop?.id,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  async logout(userId: number) {
    return await this.userService.update(userId, { refreshToken: null });
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const validPassword =
      changePasswordDto.password === changePasswordDto.rePassword;
    if (!validPassword)
      throw new BadRequestException('Password does not match!');

    const user = await this.userService.findById(userId);
    const isDuplicatePassword = await argon2.verify(
      user.password,
      changePasswordDto.password,
    );
    if (isDuplicatePassword)
      throw new BadRequestException(
        'Password used, plase re type new password',
      );

    const hashPassword = await this.hashData(changePasswordDto.password);
    return await this.userService.update(user.id, {
      password: hashPassword,
    });
  }

  async sendForgotMailRequest(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    if (!user) throw new BadRequestException('User not found!');
    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.role,
      user.shop?.id,
    );
    const sendMailDto: SendMailDto = { user: user, token: tokens.accessToken };
    await this.mailService.sendForgotPasswordRequest(sendMailDto);
  }

  async sendVerifyRequest(email: string) {
    if (!isEmail(email)) {
      throw new BadRequestException('Email format not valid');
    }
    const user = await this.userService.findOneByEmail(email);

    const mailToken = await this.getMailToken(user.id, user.username);
    const sendMailDto: SendMailDto = { user: user, token: mailToken };

    this.eventEmitter.emit(
      USER_EVENTS.REQUEST_VERIFY,
      new UserRequestVerifyEventDto(sendMailDto),
    );
  }

  hashData(data: string) {
    return hash(data);
  }

  async getMailToken(userId: number, username: string) {
    const mailToken = await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      { secret: process.env.JWT_MAIL_SECRET, expiresIn: '30s' },
    );

    return mailToken;
  }

  async handleVerifyToken(token: string) {
    const user = await this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    return user;
  }

  async decodeToken(token: string) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Error decoding token');
    }
  }

  async activeUser(typeActive: string, userId: number) {
    this.eventEmitter.emit(
      USER_EVENTS.ACTIVE,
      new UserActiveEventDto(typeActive, userId),
    );
  }

  private async getTokens(
    userId: number,
    username: string,
    role: string,
    shopId: number,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, role, shopId },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, role, shopId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
