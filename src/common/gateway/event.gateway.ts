import { OnEvent } from '@nestjs/event-emitter';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { SERVER_EVENTS } from '../events/constants/events.constant';
import { OrderService } from 'src/modules/order/services/order.service';
import { ChatSerivce } from 'src/modules/chat/chat.service';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../filters/websocket-exception.filter';
import { SendMessageDto } from './dtos/send-message.dto';
import { AddProductDto } from './dtos/add-product.dto';
import { ProductService } from 'src/modules/product/services/product.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Order } from 'src/modules/order/entities/order.entity';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
  cors: { origin: ['*'] },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
    private readonly chatService: ChatSerivce,
    private readonly productService: ProductService,
    @Inject('PROMOTION_SERVICE') readonly promotionClient: ClientProxy,
  ) {}
  @WebSocketServer()
  server: Server;
  private connectedClients: Map<number, Socket> = new Map();

  private addToConnectedClient(userId: number, client: Socket) {
    this.connectedClients.set(userId, client);
  }

  afterInit(socket: Socket) {}

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && (authHeader as string).split('')[1]) {
      try {
        const user = await this.authService.handleVerifyToken(
          (authHeader as string).split(' ')[1],
        );
        client.data.user = user;

        if (user?.role === UserRole.SHOP) {
          const orders = await this.orderService.findOrderByShop(user.shopId);
          orders.forEach((order) => {
            client.join(this.makeRoomName(order.id));
          });
        } else {
          client.join(this.makeDraftOrderName(user.id));
          const orders = await this.orderService.findOrderByUser(user?.id);
          orders.forEach((order) => {
            client.join(this.makeRoomName(order.id));
          });
        }

        this.addToConnectedClient(user.id, client);

        // console.log('rooms :: ', client.rooms);
      } catch (error) {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconect: ', socket.id, socket.data?.sub);
  }

  @OnEvent(SERVER_EVENTS.ORDER_CREATE)
  async sendNewOrderNotification(orderId: number) {
    const order = await this.orderService.findById(orderId);
    this.connectedClients.forEach((client) => {
      if (client.data.user?.shopId === order.shop.id) {
        this.clientJoinRoom(client, this.makeRoomName(order.id));
      }
    });

    this.joinOrderRoom(orderId);
    const msg = `order #${orderId} was created!`;
    this.server.to(this.makeRoomName(orderId)).emit('onOrderCreate', msg);
  }

  joinOrderRoom(orderId: number) {
    this.server.socketsJoin(this.makeRoomName(orderId));
  }

  clientJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('sendMessageToRoom')
  sendMessage(client: Socket, messagePayload: SendMessageDto) {
    console.log(messagePayload);
    if (
      !Array.from(client.rooms).includes(
        this.makeRoomName(messagePayload.orderId),
      )
    ) {
      throw new WsException('You have not chat permission in this order!');
    }
    this.chatService.saveMessage(
      messagePayload.message,
      client.data.user.sub,
      messagePayload.orderId,
    );
    this.server
      .to(this.makeRoomName(messagePayload.orderId))
      .emit('sendedMessage', messagePayload.message);
  }

  private makeRoomName(orderId: number): string {
    return `order-${orderId}`;
  }

  private makeDraftOrderName(userId: number): string {
    return `draft_order-${userId}`;
  }

  @SubscribeMessage('onAddProductToCart')
  async handleAddProductToCart(client: Socket, addProductDto: AddProductDto) {
    const product = await this.productService.findById(addProductDto.productId);
    if (!product) {
      throw new WsException('Product not found!');
    }
    let cart = await this.orderService.findOrderingCart(
      client.data.user.sub,
      product.shop.id,
    );

    if (!cart) {
      cart = await this.orderService.createCart({
        shopId: product.shop.id,
        userId: client.data.user.sub,
        orderDetails: [{ ...addProductDto }],
      });
    } else {
      cart = await this.orderService.updateCart(cart.id, { ...addProductDto });
    }

    this.server
      .to(this.makeDraftOrderName(client.data.user.id))
      .emit('onOrdering', cart);
  }
}
