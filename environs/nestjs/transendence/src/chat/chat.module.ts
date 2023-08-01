import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';
import { CommandModule } from 'src/command/command.module';

@Module({
	imports: [CommandModule],
	providers: [ChatService, PrismaService]
})
export class ChatModule {}
