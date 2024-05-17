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
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { ShopCreateDto } from '../dtos/shop.create.dto';
import { ShopUpdateDto } from '../dtos/shop.update.dto';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigCache } from 'src/common/cache/decorators/cache.decorator';
import { HttpCacheInteceptor } from 'src/common/interceptors/http-cache.interceptor';
import { PoliciesGuard } from 'src/modules/casl/guards/policy.guard';
import { CheckPolicies } from 'src/modules/casl/decorators/casl.decorator';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { User } from 'src/modules/user/entities/user.entity';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Shop } from '../entities/Shop';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ShopLocateUpdateDto } from '../dtos/shop-locate.update.dto';
import { Request } from 'express';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { PaginateDto } from '../dtos/paginate.dto';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Public()
  @UseInterceptors(HttpCacheInteceptor)
  @ConfigCache({ cacheKey: 'all_shop', eachUserConfig: true })
  @CustomResponse({
    message: 'Get shops success!',
    statusCode: HttpStatus.OK,
  })
  @Get()
  async findAll() {
    return await this.shopService.findAll();
  }

  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @UseGuards(RoleGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Shop))
  @Roles(UserRole.USER)
  @Get('find-distance')
  async findShopByDistance(
    @Req() req,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const userId = req.user['sub'];
    return await this.shopService.findShopByDistance(userId, page, limit);
  }

  @Public()
  @UseInterceptors(HttpCacheInteceptor)
  @ConfigCache({ cacheKey: 'find_shop', eachUserConfig: true })
  @CustomResponse({
    message: 'Get shop success!',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.shopService.findOneById(id);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Shop))
  @CustomResponse({
    message: 'Created shop!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('create')
  async createShop(@Body() shopCreateDto: ShopCreateDto) {
    return await this.shopService.createShop(shopCreateDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Shop))
  @CustomResponse({
    message: 'Updated shop!',
    statusCode: HttpStatus.CREATED,
  })
  @Put('update/:id')
  async updateShop(
    @Param('id', ParseIntPipe) id: number,
    @Body() shopUpdateDto: ShopUpdateDto,
  ) {
    return await this.shopService.updateShop(id, shopUpdateDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Shop))
  @CustomResponse({
    message: 'Delete shop success!',
    statusCode: HttpStatus.OK,
  })
  @Delete('delete/:id')
  async deleteShop(@Param('id', ParseIntPipe) id: number) {
    return await this.shopService.deleteShop(id);
  }
}
