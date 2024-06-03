import { BadRequestException, Injectable } from '@nestjs/common';
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
import { UserCreateEventDto } from 'src/common/events/dtos/user-create.event.dto';
import { SETTING_KEY } from 'src/modules/setting/constants/setting.constant';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private eventEmitter: EventEmitter2,
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
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
      newUser.isActive,
      newUser.shop?.id,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    const mailToken = await this.getMailToken(newUser.id, newUser.username);

    const sendMailDto: SendMailDto = { user: newUser, token: mailToken };
    await this.mailService.sendUserConfirmation(
      sendMailDto.user,
      sendMailDto.token,
    );

    this.eventEmitter.emit(
      'user.create',
      new UserCreateEventDto({
        key: SETTING_KEY.TIME_ZONE,
        value: new Date().getTimezoneOffset().toString(),
        userId: newUser.id,
      }),
    );

    return {
      user: newUser,
      tokens,
    };
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
      user.isActive,
      user.shop?.id,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logout(userId: number) {
    return await this.userService.updateUser(userId, { refreshToken: null });
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
    return await this.userService.updateUser(user.id, {
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
      user.isActive,
      user.shop?.id,
    );
    const sendMailDto: SendMailDto = { user: user, token: tokens.accessToken };
    await this.mailService.sendForgotPasswordRequest(
      sendMailDto.user,
      sendMailDto.token,
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

  async handleVerifyToken(token) {
    const user = await this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    return user;
  }

  private async getTokens(
    userId: number,
    username: string,
    role: string,
    isActive: boolean,
    shopId: number,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, role, isActive, shopId },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, role, isActive, shopId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
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
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
