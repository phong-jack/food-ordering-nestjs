import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { AuthService } from '../services/auth.service';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dtos/auth.sign-in.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { ChangePasswordDto } from '../dtos/auth.change-password.dto';
import { ForgotPasswordDto } from '../dtos/auth.forgot-password.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@sentry/node';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @CustomResponse({
    message: 'Sign up success!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('sign-up')
  signUp(@Body() userCreateDto: UserCreateDto) {
    return this.authService.signUp(userCreateDto);
  }

  @CustomResponse({
    message: 'Sign in success!',
    statusCode: HttpStatus.OK,
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @CustomResponse({
    message: 'Logout success!',
    statusCode: HttpStatus.OK,
  })
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@CurrentUser() user: any) {
    return this.authService.logout(+user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@CurrentUser() user: any) {
    const userId = user['sub'];
    const refreshToken = user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @CustomResponse({
    message: 'Send forgot mail success!',
    statusCode: HttpStatus.OK,
  })
  @Post('forgot-password')
  async sendForgotMailRequest(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.sendForgotMailRequest(forgotPasswordDto);
  }

  @CustomResponse({
    message: 'Active user success!',
    statusCode: HttpStatus.OK,
  })
  @Post('active')
  async active(
    @Query('token') token: string,
    @Query('typeActive') typeActive: string,
  ) {
    if (!token) throw new ForbiddenException('Token is none!');
    const decodedUser = await this.authService.decodeToken(token);
    await this.authService.activeUser(typeActive, decodedUser['sub']);
    return true;
  }
}
