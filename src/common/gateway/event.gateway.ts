import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { WEBSOCKET_EVENTS } from './constants/websocket.constant';
import { SERVER_EVENTS } from '../events/constants/events.constant';

@WebSocketGateway({
  cors: { origin: ['*'] },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService) {}

  afterInit(socket: Socket) {}

  async handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && (authHeader as string).split('')[1]) {
      try {
        const sub = await this.authService.handleVerifyToken(
          (authHeader as string).split(' ')[1],
        );
        socket.data.sub = sub;
        console.log('connect success:: ', socket.data.sub);
      } catch (error) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  async joinRoom(@ConnectedSocket() socket: Socket, room: string) {
    socket.join(room);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconect: ', socket.id, socket.data?.sub);
  }

  async sendNewOrderNotification(orderId: number, orderData: any) {
    this.server.to(`${orderId}`).emit('new_order', { orderId, orderData });
    this.server.emit('new_order', { orderId, orderData });
  }

  @OnEvent(SERVER_EVENTS.ORDER_CREATE)
  async createOrder(socket: Socket, orderId: number) {
    const msg = `Order #${orderId} created!`;
    const room = `room_order_${orderId}`;

    // socket.join(room);
    this.server.emit(WEBSOCKET_EVENTS.ORDER_CREATE, msg);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, orderId: number) {
    const room = `room_order_${orderId}`;
    socket.join(room);
    socket.emit('joinedRoom', room);
  }
}
