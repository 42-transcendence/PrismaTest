import { PrismaService } from "src/prisma.service";
import { ByteBuffer } from "libs/byte-buffer";
import authConfig from "src/config/authConfig";
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { ChatWebSocket } from "src/chat/utils/chatSocket";
import { jwtVerifyHMAC } from "libs/jwt";
import { encodeUTF8 } from "libs/utf8";
import { CustomException } from "src/chat/utils/exception";


enum ChatOpCode {
	Connect,
	Create,
	Auth,
	Join,
	Part,
	Chat,
}

@Injectable()
export class CommandService
{
	constructor(private prismaService : PrismaService, @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>) {}

	async command(msg : Uint8Array, ws : ChatWebSocket, clients : Map<number, ChatWebSocket>)
	{
		ws;
		this.prismaService;

		const msgBuf : ByteBuffer = ByteBuffer.from(msg);
		const code : number = msgBuf.read1();
		console.log(code);
		try
		{	if (code == ChatOpCode.Connect)
				await this.ChatServerConnect(ws, clients);
			else if (code == ChatOpCode.Create)
				await this.CreateRoom(msgBuf, ws);
		}
		catch(e)
		{}
	}
	
	private async ChatServerConnect(ws : ChatWebSocket, clients : Map<number, ChatWebSocket>) {

		const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.sJPqrqaxt8_KLfjfExnwFt1yJSkCbz5IDzBZ5C6Xuhc'

		const result = await jwtVerifyHMAC(jwt, 'HS256', encodeUTF8(this.config.jwtSecret));
		if (result.success) 
		{
			const payload = result.payload;
			clients.set(Number(payload['userId']), ws);
			const roomList = await this.prismaService.chatMember.findMany({
				where : {
					accountId : Number(payload['userId']),
				},
				select : {
					chat : true,
				}
			});
			const sendStr = JSON.stringify(roomList);
			const sendBuf = ByteBuffer.create(1 + sendStr.length);
			sendBuf.write1(ChatOpCode.Connect);
			sendBuf.writeString(sendStr);
			ws.send(sendBuf.toArray());
		}
		else 
			throw new CustomException('Connect Error');
	}

	private async CreateRoom(msgBuf : ByteBuffer, ws : ChatWebSocket)
	{
		const attibute = JSON.parse(msgBuf.readString());
		const newRoom = await this.prismaService.chat.create({
			data : {
				title : attibute['title'],
				modeFlags : Number(attibute['modeFlags']),
				password : attibute['password'],
				limit : Number(attibute['limit']),
			},
		});
		const sendStr = JSON.stringify(newRoom);
		const sendBuf = ByteBuffer.create(1 + sendStr.length);
		sendBuf.write1(ChatOpCode.Connect);
		sendBuf.writeString(sendStr);
		ws.send(sendBuf.toArray());
	}

	private async EnterRoom(msgBuf : ByteBuffer, ws : ChatWebSocket)
	{
		
	}
}
