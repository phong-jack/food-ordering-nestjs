import { OnEvent } from '@nestjs/event-emitter';
import {
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
import { UseFilters } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../filters/websocket-exception.filter';
import { SendMessageDto } from './dtos/send-message.dto';

@UseFilters(new WebsocketExceptionsFilter())
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
          const orders = await this.orderService.findOrderByUser(user?.id);
          orders.forEach((order) => {
            client.join(this.makeRoomName(order.id));
          });
        }

        this.addToConnectedClient(user.id, client);

        // const member = this.connectedClients.get(user.id)
        // if(member) {
        //   member.join(this.makeRoomName(chatId))
        // }
      } catch (error) {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  async joinRoom(@ConnectedSocket() socket: Socket, room: string) {
    socket.join(room);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconect: ', socket.id, socket.data?.sub);
  }

  @OnEvent(SERVER_EVENTS.ORDER_CREATE)
  async sendNewOrderNotification(orderId: number, orderData: any) {
    this.joinOrderRoom(orderId);
    const msg = `order #${orderId} was created!`;
    this.server.to(this.makeRoomName(orderId)).emit('onOrderCreate', msg);
  }

  joinOrderRoom(orderId: number) {
    this.server.socketsJoin(this.makeRoomName(orderId));
  }

  //test recive message:
  @SubscribeMessage('sendMessageToRoom')
  sendMessage(client: Socket, messagePayload: SendMessageDto) {
    console.log(messagePayload);

    if (
      !Array.from(client.rooms).includes(
        this.makeRoomName(messagePayload.orderId),
      )
    ) {
      // this.server.emit('error', 'You have not chat permission in this order!');
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

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() orderId: number,
  ) {
    // await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.findMessageByOrder(orderId);
    // socket.emit('send_all_messages', messages);
    socket.emit('send_all_messages');
  }

  private makeRoomName(orderId: number): string {
    return `order-${orderId}`;
  }
}
