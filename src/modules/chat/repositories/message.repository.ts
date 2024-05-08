import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';

export class MessageRepository {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(content: string, userId: number, orderId: number) {
    const newMessage = await this.messageRepository.create({
      content,
      user: { id: userId },
      orderId: orderId,
    });
    return await this.messageRepository.save(newMessage);
  }

  async findMessageByOrder(orderId) {
    const messages = await this.messageRepository.find({
      relations: { user: true },
      where: {
        orderId: orderId,
      },
    });
    return messages;
  }
}
