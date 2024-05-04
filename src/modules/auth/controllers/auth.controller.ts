import {
  Body,
  Controller,
  Get,
  HttpStatus,
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

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
