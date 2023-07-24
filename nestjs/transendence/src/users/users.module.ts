import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [EmailModule, AuthModule],
	controllers: [UsersController],
	providers: [UsersService, PrismaService]
})
export class UsersModule {}
