import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserService } from 'src/modules/user/services/user/user.service';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dtos/auth.sign-in.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { SendMailDto } from 'src/modules/mail/dtos/mail.send-mail.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(userCreateDto: UserCreateDto) {
    const userExist = await this.userService.findOneByUserName(
      userCreateDto.username,
    );
    if (userExist) {
      throw new BadRequestException('This username already exist');
    }
    const hashPassword = await this.hashData(userCreateDto.password);
    const newUser = await this.userService.createUser({
      ...userCreateDto,
      password: hashPassword,
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
      newUser.isActive,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    const mailToken = await this.getMailToken(newUser.id, newUser.username);

    const sendMailDto: SendMailDto = { user: newUser, token: mailToken };
    await this.mailService.sendUserConfirmation(
      sendMailDto.user,
      sendMailDto.token,
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
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logout(userId: number) {
    return this.userService.updateUser(userId, { refreshToken: null });
  }

  private hashData(data: string) {
    return argon2.hash(data);
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
    return user['sub'];
  }

  private async getTokens(
    userId: number,
    username: string,
    role: string,
    isActive: boolean,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, role, isActive },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
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
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
