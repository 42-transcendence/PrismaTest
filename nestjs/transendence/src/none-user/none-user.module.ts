import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { NoneUserService } from './none-user.service';
import { NoneUserController } from './none-user.controller';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { AuthGuard } from 'src/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [NoneUserService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // } //가드에 종속성 주입을 사용해서 다른 프로바이더에 주입해서 사용하고 싶다면 커스텀 프로바이더로 선언해야 한다.
  ],
  controllers: [NoneUserController]
})
export class NoneUserModule {}
// export class NoneUserModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) : any {
//     consumer
//       .apply(LoggerMiddleware, Logger2Middleware)
//       .exclude({path: '/none', method: RequestMethod.GET})
//       .forRoutes('/none')
//   }
// }
