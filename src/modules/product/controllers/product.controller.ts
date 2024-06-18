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
import { ProductCreatePolicyHandler } from 'src/modules/casl/policies/product/product.create.policy';
import { ProductUpdatePolicyHandler } from 'src/modules/casl/policies/product/product.update.policy';
import { CurrentAbilities } from 'src/modules/casl/decorators/current-ability.decorator';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { ProductDeletePolicyHandler } from 'src/modules/casl/policies/product/product.delete.policy';

@ApiBearerAuth()
@ApiTags('product')
@UseGuards(AccessTokenGuard, RoleGuard)
@Controller({ path: 'product', version: '1' })
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
  @Post('')
  async createProduct(@Body() productCreateDto: ProductCreateDto) {
    return await this.productService.createProduct(productCreateDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ProductDeletePolicyHandler())
  @CustomResponse({
    message: 'Delete product success!',
    statusCode: HttpStatus.OK,
  })
  @Roles(UserRole.SHOP)
  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    await this.productService.deleteProduct(id, abilities);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ProductUpdatePolicyHandler())
  @Patch('/change-status/:id')
  @Roles(UserRole.SHOP)
  async changeStatusProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productChangeStatusDto: ProductChangeStatusDto,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    return await this.productService.changeStatusProduct(
      id,
      productChangeStatusDto,
      abilities,
    );
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ProductUpdatePolicyHandler())
  @Roles(UserRole.SHOP)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() productUpdateDto: ProductUpdateDto,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    return await this.productService.updateProduct(
      id,
      productUpdateDto,
      abilities,
    );
  }
}
