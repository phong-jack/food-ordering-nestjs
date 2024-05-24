import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from '../dtos/user.create.dto';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @CustomResponse({
    message: 'Get all users success!',
    statusCode: HttpStatus.OK,
  })
  @Get('')
  async findAll() {
    return await this.userService.findAll();
  }

  @CustomResponse({
    message: 'Find a user success!',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @CustomResponse({
    message: 'Created new user!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('create')
  async createUser(@Body() userCreateDto: UserCreateDto) {
    const newUser = this.userService.create(userCreateDto);
    return newUser;
  }

  @CustomResponse({
    message: 'Deleted successfull!',
    statusCode: HttpStatus.OK,
  })
  @Delete('delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @CustomResponse({
    message: 'Updated user successfull!',
    statusCode: HttpStatus.OK,
  })
  @Put('update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    const updatedUser = this.userService.updateUser(id, userUpdateDto);
    return updatedUser;
  }
}
