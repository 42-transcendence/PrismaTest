// express, ws 객체 생성
import { Server} from 'ws';
import { IncomingMessage, createServer } from 'http'
import { ByteBuffer } from './byte-buffer';
import { ChatWebSocket } from './ChatSocket';

const httpServer = createServer().listen(3000);

httpServer.on('upgrade', function (request, socket, head) {
  console.log('in!')
  webSocketServer.handleUpgrade(request, socket, head, (ws) => {
    console.log('upgrade')
  })
})

const webSocketServer = new Server({
  noServer : true,
  clientTracking: true,
  WebSocket: ChatWebSocket
});

console.log('out');


// request: 클라이언트로 부터 전송된 http GET 리퀘스트 정보
webSocketServer.on("connection", (ws : ChatWebSocket, request : IncomingMessage) => {

  // 연결이 성공
  if (ws.readyState === ws.OPEN) {
    console.log('연결되었습니다!');
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