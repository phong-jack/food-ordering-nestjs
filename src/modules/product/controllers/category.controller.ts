import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { RoleGuard } from '@modules/auth/guards/role.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { UserRole } from '@modules/user/constants/user.enum';

@ApiBearerAuth()
@ApiTags('category')
@Controller({ path: 'category', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @CustomResponse({
    message: 'Get list category success!',
    statusCode: HttpStatus.OK,
  })
  @Get('list')
  async findAll() {
    return await this.categoryService.findAll();
  }

  @CustomResponse({
    message: 'Get list category of shop success!',
    statusCode: HttpStatus.OK,
  })
  @Get('shop/:shopId')
  async findByShop(@Param('shopId', ParseIntPipe) shopId: number) {
    return await this.categoryService.findByShop(shopId);
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @CustomResponse({
    message: 'Create category success!',
    statusCode: HttpStatus.OK,
  })
  @Post('')
  async create(@Body() cateogryCreateDto: CategoryCreateDto) {
    return await this.categoryService.create(cateogryCreateDto);
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @CustomResponse({
    message: 'Delete category success!',
    statusCode: HttpStatus.OK,
  })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(id);
  }
}
