import { Injectable } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import express from 'express';
import { IncomingMessage } from 'http'
import { ChatSocket } from './ChatSocket';
import { PrismaService } from 'src/prisma.service'; 

@Injectable()
export class ChatService {

	httpServer = express().listen(3001, () => {
		console.log("서버가 3001번 포트로 동작합니다.");
	});
	webSocketServer = new Server({
		server: this.httpServer,
		clientTracking: true,
		// WebSocket: ChatSocket,
	});
	
	constructor(private prisma: PrismaService) {}
	
	// request: 클라이언트로 부터 전송된 http GET 리퀘스트 정보
	ServerOn = this.webSocketServer.on("connection", (ws : ChatSocket, request : IncomingMessage) => {

		// 연결이 성공
		if (ws.readyState === ws.OPEN) {
			this.prisma.chatMember.findMany({
				where : {
					accountId : ws.id,
				}
			})
		}

		// 메세지를 받았을 때 이벤트 처리
		ws.on("message", (msg : any) => {
			for(let value of this.webSocketServer.clients)
			{
			if (value !== ws)
				value.send(`${msg}`)
			}
			// console.log(`${msg} [${ip}]`);
		});

		// 에러 처리
		ws.on("error", (error : any) => {
			// console.log(`에러 발생 : ${error} [${ip}]`);
		});

		// 연결 종료 처리
		ws.on("close", () => {
			// console.log(`[${ip}] 연결 종료`);
		});

	});
}
