import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { SettingService } from '../services/setting.service';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { SettingUpdateDto } from '../dtos/setting.update.dto';
import { SETTING_KEY } from '../constants/setting.constant';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';

@ApiBearerAuth()
@ApiTags('setting')
// @UseGuards(AccessTokenGuard, RoleGuard)
@Roles(UserRole.SHOP, UserRole.USER)
@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @CustomResponse({
    message: 'Get all setting success!',
    statusCode: HttpStatus.OK,
  })
  @Get()
  async findAll() {
    return await this.settingService.findAll();
  }

  @CustomResponse({
    message: 'Get setting success!',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.settingService.findById(id);
  }

  @CustomResponse({
    message: 'Get setting success!',
    statusCode: HttpStatus.OK,
  })
  @Get('user/:id')
  async findByUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.settingService.findByUser(userId);
  }

  @ApiQuery({
    name: 'key',
    type: 'enum',
    enum: SETTING_KEY,
    examples: {
      timeZone: {
        value: SETTING_KEY.TIME_ZONE,
        description: 'timezone key',
      },
      language: {
        value: SETTING_KEY.LANGUAGE,
        description: 'language key',
      },
    },
  })
  @CustomResponse({
    message: 'Get setting success!',
    statusCode: HttpStatus.OK,
  })
  @Get('user/:id/')
  async findByUserKey(
    @Param('id', ParseIntPipe) userId: number,
    @Query() query: SettingUpdateDto,
  ) {
    return await this.settingService.findByUserKey(userId, query.key);
  }

  @Patch('update-setting/:id')
  async updateSetting() {}
}
