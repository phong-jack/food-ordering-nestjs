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
  ValidationPipe,
} from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { Shop } from '../entities/shop.entity';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ShopLocateUpdateDto } from '../dtos/shop-locate.update.dto';
import { Request } from 'express';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { PaginateDto } from '../dtos/paginate.dto';

import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import {
  ShopDeletePolicyHandler,
  ShopFindDistancePolicyHanlder,
  ShopUpdatePolicyHandler,
} from 'src/modules/casl/policies/shop/shop.policy';
import { CurrentAbilities } from 'src/modules/casl/decorators/current-ability.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { ShopSearchDto } from '../dtos/shop.search.dto';
import { categoryIdsToArray, stringArrayToArray } from 'src/utils';
import { IsNotEmpty } from 'class-validator';
import { ShopFilterDto } from '../dtos/shop.filter.dto';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('shop')
@Controller({ path: 'shop', version: '1' })
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
    @CurrentUser() user: any,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.shopService.findShopByDistance(+user['sub'], page, limit);
  }

  @ApiQuery({
    name: 'keyword',
    required: true,
    type: String,
    example: 'Trà sữa',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    examples: {
      name: {
        value: 'name',
        description: 'Sort by name',
      },
    },
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    examples: {
      ASC: { value: 'ASC', description: 'order by ASC' },
      DESC: { value: 'DESC', description: 'order by DESC' },
    },
  })
  @Public()
  @CustomResponse({
    message: 'Get shop success!',
    statusCode: HttpStatus.OK,
  })
  @Get('search')
  async searchShopWithProduct(@Query() shopSearchDto: ShopSearchDto) {
    return await this.shopService.searchShopWithProduct(shopSearchDto);
  }

  @ApiParam({
    name: 'categoryIds',
    required: false,
    examples: {
      oneCategory: {
        value: '3',
        description: 'filter shop have category id =3',
      },
      multiCategory: {
        value: '2,3',
        description:
          'filter shop have category id 3 and 2 ... with delimiter ","',
      },
      allCategory: {
        value: 'all',
        description: 'Filter no category (Get all shop)',
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    examples: {
      name: {
        value: 'name',
        description: 'Sort by name',
      },
    },
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    examples: {
      ASC: { value: 'ASC', description: 'order by ASC' },
      DESC: { value: 'DESC', description: 'order by DESC' },
    },
  })
  @Public()
  @CustomResponse({
    message: 'Get shop success!',
    statusCode: HttpStatus.OK,
  })
  @Get('filter/:categoryIds')
  async filterShopWithCategory(
    @Param('categoryIds') categoryIds: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const categoryIdsArray = categoryIdsToArray(categoryIds, ',');

    return await this.shopService.filterShopWithCategory(
      categoryIdsArray,
      paginationDto,
    );
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
  @CheckPolicies(new ShopFindDistancePolicyHanlder())
  @CustomResponse({
    message: 'Created shop!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('')
  async createShop(@Body() shopCreateDto: ShopCreateDto) {
    return await this.shopService.createShop(shopCreateDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ShopUpdatePolicyHandler())
  @CustomResponse({
    message: 'Updated shop!',
    statusCode: HttpStatus.CREATED,
  })
  @Put(':id')
  async updateShop(
    @Param('id', ParseIntPipe) id: number,
    @Body() shopUpdateDto: ShopUpdateDto,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    return await this.shopService.updateShop(id, shopUpdateDto, abilities);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ShopDeletePolicyHandler())
  @CustomResponse({
    message: 'Delete shop success!',
    statusCode: HttpStatus.OK,
  })
  @Delete(':id')
  async deleteShop(@Param('id', ParseIntPipe) id: number) {
    return await this.shopService.deleteShop(id);
  }
}
