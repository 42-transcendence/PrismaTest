import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

import { INestApplication } from '@nestjs/common';

// import { Server, WebSocket} from 'ws';
// import { IncomingMessage } from 'http'
// // import { ByteBuffer } from 'libs/byte-buffer'; 
// import { INestApplication } from '@nestjs/common';
// import * as net from 'net'

// async function start(app : INestApplication<any>)
// {
//   const webSocketServer = new Server({
//     noServer : true,
//     clientTracking: true,
//   });

//   await app.getHttpServer().on('upgrade', (request : IncomingMessage, socket : net.Socket, head : Buffer) => {
//     webSocketServer.handleUpgrade(request, socket, head, (ws : WebSocket, request: IncomingMessage) => {
//         request;
//         // 연결이 성공
//         if (ws.readyState === ws.OPEN) {
//           console.log('연결되었습니다!');
//         }
    
//         // 메세지를 받았을 때 이벤트 처리
//         ws.on("message", (msg : Uint8Array) => {
//           console.log(`msg : ${msg}`)
    
//         });
    
//         // 에러 처리
//         ws.on("error", (error : any) => {
//           error;
//         });
    
//         // 연결 종료 처리
//         ws.on("close", () => {
//             console.log('끝!')
//         });
//     })
//   })
// }

let app : INestApplication<any>;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
  // await start(app);
}

bootstrap()
