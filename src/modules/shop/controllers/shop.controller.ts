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
  UseInterceptors,
} from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

@ApiBearerAuth()
@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @CustomResponse({
    message: 'Get shops success!',
    statusCode: HttpStatus.OK,
  })
  @UseInterceptors(HttpCacheInteceptor)
  @ConfigCache({ cacheKey: 'Cache', eachUserConfig: true })
  @Get()
  async findAll() {
    return await this.shopService.findAll();
  }

  @CustomResponse({
    message: 'Get shop success!',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.shopService.findOneById(id);
  }

  @CustomResponse({
    message: 'Created shop!',
    statusCode: HttpStatus.CREATED,
  })
  @Post('create')
  async createShop(@Body() shopCreateDto: ShopCreateDto) {
    return await this.shopService.createShop(shopCreateDto);
  }

  @CustomResponse({
    message: 'Created shop!',
    statusCode: HttpStatus.CREATED,
  })
  @Put('update/:id')
  async updateShop(
    @Param('id', ParseIntPipe) id: number,
    @Body() shopUpdateDto: ShopUpdateDto,
  ) {
    return await this.shopService.updateShop(id, shopUpdateDto);
  }

  @CustomResponse({
    message: 'Delete shop success!',
    statusCode: HttpStatus.OK,
  })
  @Delete('/delete/:id')
  async deleteShop(@Param('id', ParseIntPipe) id: number) {
    return await this.shopService.deleteShop(id);
  }
}
