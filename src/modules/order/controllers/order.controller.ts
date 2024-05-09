import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { OrderChangeStatusDto } from '../dtos/order.change-status.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { ConfigCache } from 'src/common/cache/decorators/cache.decorator';
import { HttpCacheInteceptor } from 'src/common/interceptors/http-cache.interceptor';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ConfigCache({ cacheKey: 'order.find', eachUserConfig: true })
  @UseInterceptors(HttpCacheInteceptor)
  @CustomResponse({ message: 'Get order success', statusCode: HttpStatus.OK })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findById(id);
  }

  @CustomResponse({ message: 'Created order', statusCode: HttpStatus.CREATED })
  @Post('create')
  async createOrder(@Body() orderCreateDto: OrderCreateDto) {
    return await this.orderService.createOrder(orderCreateDto);
  }

  @CustomResponse({
    message: 'Change order status success',
    statusCode: HttpStatus.OK,
  })
  @Patch('change-status/:id')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderChangeStatusDto: OrderChangeStatusDto,
  ) {
    return await this.orderService.changeStatus(id, orderChangeStatusDto);
  }
}
