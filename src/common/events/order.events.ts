import { Injectable } from '@nestjs/common';
import { EventGateway } from '../gateway/event.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { SERVER_EVENTS } from './constants/events.constant';
import { WEBSOCKET_EVENTS } from '../gateway/constants/websocket.constant';

@Injectable()
export class OrderEvents {
  constructor(private readonly gateway: EventGateway) {}

  @OnEvent(SERVER_EVENTS.ORDER_CREATE)
  orderCreate(orderId: number) {
    // this.gateway.server.emit(WEBSOCKET_EVENTS.ORDER_CREATE, orderId);
    const room = `order_create_${orderId}`;

    const msg = `Order #${orderId} created!`;
    this.gateway.server.emit(WEBSOCKET_EVENTS.ORDER_CREATE, msg);
  }
}
