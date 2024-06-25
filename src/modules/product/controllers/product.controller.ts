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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';

@ApiBearerAuth()
@ApiTags('product')
@UseGuards(AccessTokenGuard, RoleGuard)
@Controller({ path: 'product', version: '1' })
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  @Get('list')
  async findByShop(@Query('shop', ParseIntPipe) shopId: number) {
    return await this.productService.findByShop(shopId);
  }

  @ApiQuery({ name: 'keyword', required: false, type: String, example: 'Trà' })
  @Public()
  @CustomResponse({
    message: 'Get products success!',
    statusCode: HttpStatus.OK,
  })
  @Get('search-in-shop')
  async searchProductsInShop(
    @Query('shopId', ParseIntPipe) shopId: number,
    @Query('keyword') keyword?: string,
  ) {
    return await this.productService.searchProductsInShop(shopId, keyword);
  }

  @CustomResponse({
    message: 'Get product success!',
    statusCode: HttpStatus.OK,
  })
  @Get('detail/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: 'Chân gà nướng',
        },
        description: { type: 'string', default: 'Gà kiến nướng cực ngon' },
        price: { type: 'number', example: 20000 },
        categoryId: {
          type: 'number',
          default: 'Some category id',
          example: 1,
        },
        shopId: { type: 'number', default: 1000012108 },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'name',
        'description',
        'price',
        'categoryId',
        'shopId',
        'image',
      ],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @CustomResponse({
    message: 'Created product!',
    statusCode: HttpStatus.CREATED,
  })
  @Roles(UserRole.SHOP, UserRole.ADMIN)
  @Post('')
  async createProduct(
    @Body() productCreateDto: ProductCreateDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const folderName = 'product';
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(
      image,
      folderName,
    );
    console.log('Check dto:: ', cloudinaryResponse);

    return await this.productService.createProduct({
      ...productCreateDto,
      image: cloudinaryResponse.url,
    });
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
