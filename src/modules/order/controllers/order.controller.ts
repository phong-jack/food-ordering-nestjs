import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApiTags } from '@nestjs/swagger';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @CustomResponse({ message: 'Created order', statusCode: HttpStatus.CREATED })
  @Post('create')
  async createOrder(@Body() orderCreateDto: OrderCreateDto) {
    return await this.orderService.createOrder(orderCreateDto);
  }
}
