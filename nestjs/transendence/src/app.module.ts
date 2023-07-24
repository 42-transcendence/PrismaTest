import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { NoneUserModule } from './none-user/none-user.module';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';

@Module({
  imports: [UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    NoneUserModule,
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
