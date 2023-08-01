import { Injectable } from '@nestjs/common';
import { Server, WebSocketServer } from 'ws';
import express from 'express';
import { IncomingMessage } from 'http';
import { CommandService } from 'src/command/command.service'; 
import { ChatWebSocket } from './utils/chatSocket';

@Injectable()
export class ChatService {

	private webSocketServer : WebSocketServer;
	private clients : Map<number, ChatWebSocket>;

	constructor(private commandService : CommandService) {
		this.clients = new Map();
		this.webSocketServer = new Server({
			server: express().listen(5000, () => {
				console.log("서버가 5000번 포트로 동작합니다.");
			
			}),
			clientTracking: true,
			WebSocket : ChatWebSocket
		});
		if (this.webSocketServer)
			this.webSocketServer.on("connection", (ws : ChatWebSocket, request : IncomingMessage) => {

				request;
				// 연결이 성공
				if (ws.readyState === ws.OPEN) {
					console.log("연결완료!");
					// 메세지를 받았을 때 이벤트 처리
				}
				ws.on("message", (msg : Uint8Array) => {
					this.commandService.command(msg, ws, this.clients);
				});
		
				// 에러 처리
				ws.on("error", (error : any) => {
					error;
					// console.log(`에러 발생 : ${error} [${ip}]`);
				});
		
				// 연결 종료 처리
				ws.on("close", () => {
					// console.log(`[${ip}] 연결 종료`);
				});
			})
		// else
	}
}
