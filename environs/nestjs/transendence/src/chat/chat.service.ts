import { BadRequestException, HttpServer, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { Server, WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import { IncomingMessage } from 'http';
import arrayBufferToString from './utils/arrayBufferToString';
import { BufType, commandCodeExtract, getLength } from './utils/utils';

export class ChatService {

	private webSocketServer : WebSocketServer;
	
	constructor(private prisma: PrismaService) {
		this.webSocketServer = new Server({
			server: express().listen(5000, () => {
				console.log("서버가 5000번 포트로 동작합니다.");
			}),
			clientTracking: true,
		});
		if (this.webSocketServer)
			this.webSocketServer.on("connection", (ws : WebSocket, request : IncomingMessage) => {

				// 연결이 성공
				if (ws.readyState === ws.OPEN) {
					// this.prisma.chatMember.findMany({
					// 	where : {
					// 		// accountId : 
					// 	}
					// })
					console.log("연결완료!");
				}
		
				// 메세지를 받았을 때 이벤트 처리
				ws.on("message", (msg : any) => {
					const msgBuf : BufType = { buf : msg }
					const commandCode =  commandCodeExtract(msgBuf);
					const length = getLength(msgBuf);
				});
		
				// 에러 처리
				ws.on("error", (error : any) => {
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
