import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  VERSION_NEUTRAL,
  Version,
} from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from '../dtos/user.create.dto';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from '../constants/user.enum';
import { CheckPolicies } from 'src/modules/casl/decorators/casl.decorator';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { User } from '../entities/user.entity';
import { PoliciesGuard } from 'src/modules/casl/guards/policy.guard';
import { UserAuthorizeGuard } from 'src/modules/casl/guards/user.guard';
import { UserChangePasswordDto } from '../dtos/user.change-password.dto';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { CurrentAbilities } from '@modules/casl/decorators/current-ability.decorator';
import { UserUpdatePolicy } from '@modules/casl/policies/user/user.update.policy';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@ApiTags('user')
@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @CustomResponse({
    message: 'Get all users success!',
    statusCode: HttpStatus.OK,
  })
  @Get('list')
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(UserAuthorizeGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Roles(UserRole.SHOP, UserRole.USER)
  @CustomResponse({
    message: 'Find a user success!',
    statusCode: HttpStatus.OK,
  })
  @Get('detail/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @CustomResponse({
    message: 'Created new user!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('')
  async createUser(@Body() userCreateDto: UserCreateDto) {
    const newUser = this.userService.create(userCreateDto);
    return newUser;
  }

  @CustomResponse({
    message: 'Deleted successfull!',
    statusCode: HttpStatus.OK,
  })
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @CustomResponse({
    message: 'Updated user successfull!',
    statusCode: HttpStatus.OK,
  })
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    const updatedUser = this.userService.update(id, userUpdateDto);
    return updatedUser;
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UserUpdatePolicy())
  @CustomResponse({
    message: 'Change user password successfull!',
    statusCode: HttpStatus.OK,
  })
  @Patch(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() userChangePasswordDto: UserChangePasswordDto,
    @CurrentAbilities() abilities: AppAbility,
  ) {
    return await this.userService.changePassword(
      id,
      userChangePasswordDto,
      abilities,
    );
  }
}
