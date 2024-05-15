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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { PoliciesGuard } from 'src/modules/casl/guards/policy.guard';
import { CheckPolicies } from 'src/modules/casl/decorators/casl.decorator';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { Product } from '../entities/product.entity';
import { HttpCacheInteceptor } from 'src/common/interceptors/http-cache.interceptor';
import { ConfigCache } from 'src/common/cache/decorators/cache.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ProductAuthorizeGuard } from 'src/modules/casl/guards/product.guard';

@ApiBearerAuth()
@ApiTags('product')
@UseGuards(AccessTokenGuard, RoleGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  // @Public()
  // @UseInterceptors(HttpCacheInteceptor)
  // @ConfigCache({ cacheKey: 'Cache', eachUserConfig: true })
  // @CustomResponse({
  //   message: 'Get products success!',
  //   statusCode: HttpStatus.OK,
  // })
  // @Get('')
  // async findAll() {
  //   return await this.productService.findAll();
  // }

  @Public()
  @ApiQuery({ example: '1', name: 'shop' })
  @CustomResponse({
    message: 'Get products success!',
    statusCode: HttpStatus.OK,
  })
  @Get('')
  async findByShop(@Query('shop', ParseIntPipe) shopId: number) {
    return await this.productService.findByShop(shopId);
  }

  @CustomResponse({
    message: 'Get product success!',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }

  @CustomResponse({
    message: 'Created product!',
    statusCode: HttpStatus.CREATED,
  })
  @Roles(UserRole.SHOP)
  @Post('create')
  async createProduct(@Body() productCreateDto: ProductCreateDto) {
    return await this.productService.createProduct(productCreateDto);
  }

  @CustomResponse({
    message: 'Delete product success!',
    statusCode: HttpStatus.OK,
  })
  @Roles(UserRole.SHOP)
  @Delete('delete/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
  }

  @UseGuards(ProductAuthorizeGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Product))
  @Patch('/change-status/:id')
  @Roles(UserRole.SHOP)
  async changeStatusProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productChangeStatusDto: ProductChangeStatusDto,
  ) {
    return await this.productService.changeStatusProduct(
      id,
      productChangeStatusDto,
    );
  }
}
