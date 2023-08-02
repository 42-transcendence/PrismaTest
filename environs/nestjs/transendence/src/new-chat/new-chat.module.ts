import { Module } from '@nestjs/common';
import { NewChatService } from './new-chat.service';

@Module({
  providers: [NewChatService]
})
export class NewChatModule {}
