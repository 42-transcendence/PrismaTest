// express, ws 객체 생성
import * as ws from 'ws';
import express from 'express';
import * as http from 'http'

const app = express();

const httpServer = app.listen(3001, () => {
  console.log("서버가 3001번 포트로 동작합니다.");
});

const webSocketServer = new ws.Server({
  server: httpServer,
  clientTracking: true,
});

webSocketServer.on("connection", (ws : ws, request : http.IncomingMessage) => {
  // wss 은 웹소켓 서버를 의미하고, 콜백 함수로 받아온 ws 는 연결된 클라이언트를 의미한다.
  // request: 클라이언트로 부터 전송된 http GET 리퀘스트 정보
  // 연결한 클라이언트 ip 확인
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

  console.log(`클라이언트 [${ip}] 접속`);
  // console.log(this);
  // console.log(request);
  // console.log("\n\n\n\n\n");
  // console.log(ws);
  console.log(webSocketServer.clients);


  // 연결이 성공
  if (ws.readyState === ws.OPEN) {
    console.log(`[${ip}] 연결 성공`);
  }

  // 메세지를 받았을 때 이벤트 처리
  ws.on("message", (msg : any) => {
    for(let value of webSocketServer.clients)
    {
      if (value !== ws)
        value.send(`${msg}`)
    }
    console.log(`${msg} [${ip}]`);
    // ws.send(`${msg} 메세지를 확인했어요.`);
  });

  // 에러 처리
  ws.on("error", (error : any) => {
    console.log(`에러 발생 : ${error} [${ip}]`);
  });

  // 연결 종료 처리
  ws.on("close", () => {
    console.log(`[${ip}] 연결 종료`);
  });
});