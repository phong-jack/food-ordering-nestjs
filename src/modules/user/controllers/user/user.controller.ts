import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from '../../dtos/user.create.dto';
import { CustomeResponse } from 'src/common/decorators/custom-response.interceptor';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @CustomeResponse({
    message: 'Get all users success!',
    statusCode: HttpStatus.OK,
  })
  @Get('')
  async findAll() {
    return await this.userService.findAll();
  }

  @CustomeResponse({
    message: 'Find a user success!',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @CustomeResponse({
    message: 'Created new user!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('create')
  async createUser(@Body() userCreateDto: UserCreateDto) {
    const newUser = this.userService.createUser(userCreateDto);
    return newUser;
  }
}
