import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from './command/command.module';
import { NewChatModule } from './new-chat/new-chat.module';
import authConfig from './config/authConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`./src/config/env/.${process.env['NODE_ENV']}.env`],
      load: [authConfig],
      isGlobal: true,
      // validationSchema,
    }),
    CommandModule,
    ChatModule,
    NewChatModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
