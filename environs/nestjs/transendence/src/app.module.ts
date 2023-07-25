import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { OtpController } from './otp/otp.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController, OtpController],
  providers: [AppService],
})
export class AppModule {}
