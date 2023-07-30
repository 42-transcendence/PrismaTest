import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	providers: [ChatService, PrismaService]
})
export class ChatModule {}
