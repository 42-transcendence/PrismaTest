import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './none-user/logger/logger3.middleware';
import { AuthGuard } from './auth.guard';
// import * as dotenv from 'dotenv'
// import * as path from 'path'

// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV === 'production') ? '.production.env' : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
//   )
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))
  // app.use(logger3); // NestFactory.create 로 만든 앱은 INestApplication 타입을 가지고 있는데 여기에 정의된 use() 메서드를 사용하여 미들웨어를 설정, 클래스를 인수로 받을 수 없다.
  // app.useGlobalGuards(new AuthGuard()); // useGlobalGuards 함수를 사용하여 전역 가드를 설정한다.
  await app.listen(3000);
}
bootstrap();
