// express, ws 객체 생성
import { Server } from 'ws';
import express from 'express';
import { IncomingMessage } from 'http'
import { ChatSocket } from './ChatSocket';

const app = express();

const httpServer = app.listen(3001, () => {
  console.log("서버가 3001번 포트로 동작합니다.");
});

const webSocketServer = new Server({
  server: httpServer,
  clientTracking: true,
  WebSocket: ChatSocket,
});

// request: 클라이언트로 부터 전송된 http GET 리퀘스트 정보
webSocketServer.on("connection", (ws : ChatSocket, request : IncomingMessage) => {

  // 연결이 성공
  if (ws.readyState === ws.OPEN) {
    console.log('연결되었습니다!');
    console.log(ws.getUserid());
  }

  // 메세지를 받았을 때 이벤트 처리
  ws.on("message", (msg : any) => {
    for(let value of webSocketServer.clients)
    {
      if (value !== ws)
        value.send(`${msg}`)
    }
  });

  // 에러 처리
  ws.on("error", (error : any) => {
  });

  // 연결 종료 처리
  ws.on("close", () => {
  });

});