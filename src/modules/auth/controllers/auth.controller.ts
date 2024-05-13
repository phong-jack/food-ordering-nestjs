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

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @CustomResponse({
    message: 'Sign up success!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('signUp')
  signUp(@Body() userCreateDto: UserCreateDto) {
    return this.authService.signUp(userCreateDto);
  }

  @CustomResponse({
    message: 'Sign in success!',
    statusCode: HttpStatus.OK,
  })
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @CustomResponse({
    message: 'Logout success!',
    statusCode: HttpStatus.OK,
  })
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req) {
    return this.authService.logout(req.user['sub']);
  }

  @CustomResponse({
    message: 'Change password success!',
    statusCode: HttpStatus.OK,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user['sub'];
    return await this.authService.changePassword(userId, changePasswordDto);
  }

  @CustomResponse({
    message: 'Send forgot mail success!',
    statusCode: HttpStatus.OK,
  })
  @Post('forgot-password')
  async sendForgotMailRequest(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.sendForgotMailRequest(forgotPasswordDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
