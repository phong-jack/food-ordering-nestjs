import { Module } from '@nestjs/common';
import { ChatSerivce } from './chat.service';
import { MessageRepository } from './repositories/message.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageRepository])],
  providers: [ChatSerivce, MessageRepository],
  exports: [ChatSerivce],
})
export class ChatModule {}
