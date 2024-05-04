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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constants/user.enum';

@ApiBearerAuth()
@ApiTags('product')
@UseGuards(AccessTokenGuard, RoleGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @CustomResponse({
    message: 'Get products success!',
    statusCode: HttpStatus.OK,
  })
  @Roles(UserRole.SHOP)
  @Get('')
  async findAll() {
    return await this.productService.findAll();
  }

  @CustomResponse({
    message: 'Get product success!',
    statusCode: HttpStatus.OK,
  })
  @Roles(UserRole.SHOP)
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
