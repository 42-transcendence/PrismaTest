import { Module } from '@nestjs/common';
import { EventGateway } from './new-chat.service';
import { CommandModule } from 'src/command/command.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports : [CommandModule],
  providers: [EventGateway, PrismaService]
})
export class NewChatModule {}
