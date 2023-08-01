import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	providers : [CommandService, PrismaService],
	exports: [CommandService]
})
export class CommandModule {}
