import { Injectable, INestApplication } from '@nestjs/common';
import { Server, WebSocketServer, WebSocket } from 'ws';
// import express from 'express';
import { IncomingMessage } from 'http';
import { CommandService } from 'src/command/command.service'; 
import { ChatWebSocket } from './utils/chatSocket';
import * as net from 'net'

@Injectable()
export class ChatService {
	private webSocketServer : WebSocketServer;
	private clients : Map<ChatWebSocket, number>;

	constructor(private commandService : CommandService) {
		this.clients = new Map();
		this.webSocketServer = new Server({
			noServer : true,
			clientTracking: true,
			WebSocket : ChatWebSocket
		});
		// 	this.webSocketServer.on("connection", (ws : ChatWebSocket, request : IncomingMessage) => {

		// 		request;
		// 		// 연결이 성공
		// 		if (ws.readyState === ws.OPEN) {
		// 			console.log("연결완료!");
		// 			// 메세지를 받았을 때 이벤트 처리
		// 		}
		// 		ws.on("message", (msg : Uint8Array) => {
		// 			this.commandService.command(msg, ws, this.clients);
		// 		});
		
		// 		// 에러 처리
		// 		ws.on("error", (error : any) => {
		// 			error;
		// 			// console.log(`에러 발생 : ${error} [${ip}]`);
		// 		});
		
		// 		// 연결 종료 처리
		// 		ws.on("close", () => {
		// 			// console.log(`[${ip}] 연결 종료`);
		// 		});
		// 	})
		// // else
	}

	async ChatServerOn(app : INestApplication<any>) {
		await app.getHttpServer().on('upgrade', (request : IncomingMessage, socket : net.Socket, head : Buffer) => {
			this.webSocketServer.handleUpgrade(request, socket, head, (ws :WebSocket, request: IncomingMessage) => {
				if (!(ws instanceof ChatWebSocket)) {
					return;
				}
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
		})
	}
}
