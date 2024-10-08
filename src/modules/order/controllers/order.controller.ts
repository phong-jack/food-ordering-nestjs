import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { OrderChangeStatusDto } from '../dtos/order.change-status.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { ConfigCache } from 'src/common/cache/decorators/cache.decorator';
import { HttpCacheInteceptor } from 'src/common/interceptors/http-cache.interceptor';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { OrderAuthorizeGuard } from 'src/modules/casl/guards/order.guard';
import { CheckPolicies } from 'src/modules/casl/decorators/casl.decorator';
import { Order } from '../entities/order.entity';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/modules/casl/guards/policy.guard';
import { CurrentAbilities } from 'src/modules/casl/decorators/current-ability.decorator';
import { OrderUpdatePolicyHandler } from 'src/modules/casl/policies/order/order.update.policy';
import { OrderReadPolicyHandler } from 'src/modules/casl/policies/order/order.read.policy';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from '@sentry/node';

@UseGuards(AccessTokenGuard, RoleGuard)
@ApiBearerAuth()
@ApiTags('order')
@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Roles(UserRole.SHOP, UserRole.ADMIN)
  @CustomResponse({
    message: 'Get orders by shop success!',
    statusCode: HttpStatus.OK,
  })
  @Get('shop/:shopId')
  async findByShop(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log('Check query:: ', { page, limit });

    return await this.orderService.findByShop(shopId, page, limit);
  }

  @UseGuards(OrderAuthorizeGuard)
  @CheckPolicies(new OrderReadPolicyHandler())
  @Roles(UserRole.SHOP, UserRole.USER, UserRole.SHIPPER, UserRole.ADMIN)
  @CustomResponse({ message: 'Get order success', statusCode: HttpStatus.OK })
  @Get('detail/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findById(id);
  }

  @Roles(UserRole.USER)
  @CustomResponse({ message: 'Created order', statusCode: HttpStatus.CREATED })
  @Post()
  async createOrder(
    @CurrentUser() user: any,
    @Body() orderCreateDto: OrderCreateDto,
  ) {
    return await this.orderService.createOrder({
      ...orderCreateDto,
      userId: +user['sub'],
    });
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new OrderUpdatePolicyHandler())
  @Roles(UserRole.USER, UserRole.ADMIN)
  @CustomResponse({
    message: 'User change order status success',
    statusCode: HttpStatus.OK,
  })
  @Patch('user-change-status/:id')
  async userChangeOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderChangeStatusDto: OrderChangeStatusDto,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    return await this.orderService.userChangeOrderStatus(
      id,
      orderChangeStatusDto,
      abilities,
    );
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new OrderUpdatePolicyHandler())
  @Roles(UserRole.SHIPPER, UserRole.ADMIN)
  @CustomResponse({
    message: 'Shipper change order status success',
    statusCode: HttpStatus.OK,
  })
  @Patch('shipper-change-status/:id')
  async shipperChangeOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderChangeStatusDto: OrderChangeStatusDto,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    return await this.orderService.shipperChangeOrderStatus(
      id,
      orderChangeStatusDto,
      abilities,
    );
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new OrderUpdatePolicyHandler())
  @Roles(UserRole.SHOP, UserRole.ADMIN)
  @CustomResponse({
    message: 'Shop change order status success',
    statusCode: HttpStatus.OK,
  })
  @Patch('shop-change-status/:id')
  async shopChangeOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderChangeStatusDto: OrderChangeStatusDto,
    @CurrentAbilities()
    abilities: AppAbility,
  ) {
    return await this.orderService.shopChangeOrderStatus(
      id,
      orderChangeStatusDto,
      abilities,
    );
  }

  @UseGuards(OrderAuthorizeGuard)
  @CheckPolicies(new OrderReadPolicyHandler())
  @Roles(UserRole.SHOP)
  @CustomResponse({
    message: 'Get report success',
    statusCode: HttpStatus.OK,
  })
  @Get('report/:shopId')
  async reportOrderByDate(
    @Param('shopId') shopId: number,
    @Query('dateStart') date1: string,
    @Query('dateEnd') date2: string,
  ) {
    return await this.orderService.statisticsOrderByDay(shopId, date1, date2);
  }
}
