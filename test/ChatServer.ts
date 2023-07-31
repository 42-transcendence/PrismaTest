// express, ws 객체 생성
import { Server, WebSocket } from 'ws';
import express from 'express';
import { IncomingMessage } from 'http'
import arrayBufferToString from './arrayBufferToString'
import { BufType, commandCodeExtract, getLength } from './utils'
import { ByteBuffer } from './byte-buffer';
import { ChatWebSocket } from './ChatSocket';

const app = express();

const httpServer = app.listen(3001, () => {
  console.log("서버가 3001번 포트로 동작합니다.");
});

// console.log(httpServer);

const webSocketServer = new Server({
  server: httpServer,
  clientTracking: true,
  WebSocket: ChatWebSocket
});

// request: 클라이언트로 부터 전송된 http GET 리퀘스트 정보
webSocketServer.on("connection", (ws : ChatWebSocket, request : IncomingMessage) => {

  // 연결이 성공
  if (ws.readyState === ws.OPEN) {
    console.log('연결되었습니다!');
    // console.log('userId: ', ws.opt.userId);
  }

  // 메세지를 받았을 때 이벤트 처리
  ws.on("message", (msg : Uint8Array) => {
    const msgBuf : ByteBuffer = ByteBuffer.from(msg);
    const commandCode = msgBuf.read1();
    const _2 = msgBuf.read2Unsigned()
    const str = msgBuf.readString();
    console.log(`commandCode : ${commandCode}, _2 : ${_2} str : ${str}`)
    // for(let value of webSocketServer.clients)
    // {
    //   if (value !== ws)
    //     value.send(`${msg}`)
    // }
  });

  // 에러 처리
  ws.on("error", (error : any) => {
  });

  // 연결 종료 처리
  ws.on("close", () => {
  });

});