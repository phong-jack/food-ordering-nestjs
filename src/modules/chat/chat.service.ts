import { Injectable } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';

@Injectable()
export class ChatSerivce {
  constructor(private messageRepository: MessageRepository) {}

  async saveMessage(content: string, userId: number, orderId: number) {
    return await this.messageRepository.saveMessage(content, userId, orderId);
  }

  async findMessageByOrder(orderId: number) {
    return await this.messageRepository.findMessageByOrder(orderId);
  }
}
