import { PrismaService } from "src/prisma.service";
import { ByteBuffer } from "libs/byte-buffer";
import authConfig from "src/config/authConfig";
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { ChatWebSocket } from "src/chat/utils/chatSocket";
import { jwtVerifyHMAC } from "libs/jwt";
import { encodeUTF8 } from "libs/utf8";
import { CustomException } from "src/chat/utils/exception";
import { Chat, RoomCreateDTO } from "./commandUtils/utils";
import { CreateChatMemberArray } from "./commandUtils/utils";


enum ChatOpCode {
	Connect,
	LoadFriendsList,
	Create,
	Enter,
	PublicSearch,
	Auth,
	Join,
	Part,
	Chat,
}

@Injectable()
export class CommandService
{
	constructor(private prismaService : PrismaService, @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>) {}

	async command(msg : Uint8Array, ws : ChatWebSocket, clients : Map<ChatWebSocket, number>)
	{
		const msgBuf : ByteBuffer = ByteBuffer.from(msg);
		const code : number = msgBuf.read1();
		const socketUserId : number = Number(clients.get(ws));
		console.log(code);
		try
		{	if (code == ChatOpCode.Connect)
				await this.ChatServerConnect(ws, clients);
			else if (code == ChatOpCode.Create)
				await this.CreateRoom(msgBuf, ws, socketUserId);
			else if (code == ChatOpCode.Enter)
				await this.EnterRoom(msgBuf, ws);
		}
		catch(e)
		{}
	}

	private readData(Buf : ByteBuffer) : object
	{
		return JSON.parse(Buf.readString());
	}

	private sendData(ws : ChatWebSocket, commandCode : ChatOpCode, sendMsg : object)
	{
		const sendStr = JSON.stringify(sendMsg);
		const sendBuf = ByteBuffer.create(1 + sendStr.length);
		sendBuf.write1(commandCode);
		sendBuf.writeString(sendStr);
		ws.send(sendBuf.toArray());
	}

	private async LoadFriendList(ws : ChatWebSocket, userId : number)
	{
		const friendList = await this.prismaService.friend.findMany({
			where : {
				accountId : userId,
			},
			select : {
				friendAccount : {
					select : {
						id : true,
						nickName : true,
						nickTag : true,
						avatarKey: true
					}
				},
			}
		}) // 올바른 값이 들어왔는지 확인
		this.sendData(ws, ChatOpCode.LoadFriendsList, friendList);
		
	}
	
	private async ChatServerConnect(ws : ChatWebSocket, clients : Map<ChatWebSocket, number>) {

		const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.sJPqrqaxt8_KLfjfExnwFt1yJSkCbz5IDzBZ5C6Xuhc'

		const result = await jwtVerifyHMAC(jwt, 'HS256', encodeUTF8(this.config.jwtSecret));
		if (result.success) 
		{
			const payload = result.payload;
			const userId : number = Number(payload['userId']);
			clients.set(ws, userId);
			const roomList = await this.prismaService.chatMember.findMany({
				where : {
					accountId : userId,
				},
				select : {
					chat : true,
				}
			}); // 올바른 값이 들어왔는지 확인
			this.sendData(ws, ChatOpCode.Connect, roomList);
		}
		else 
			throw new CustomException('Connect Error');
	}

	private async CreateRoom(msgBuf : ByteBuffer, ws : ChatWebSocket, socketUserId : number)
	{
		const attibute : RoomCreateDTO = JSON.parse(msgBuf.readString()); // title, modeflags, password, limit가 있는지 확인 -> error처리
		const newRoom = await this.prismaService.chat.create({
			data : {
				title : attibute.RoomAttibutes.title,
				modeFlags : attibute.RoomAttibutes.modeFlags,
				password : attibute.RoomAttibutes.password,
				limit : attibute.RoomAttibutes.limit,
			},
		}); // 제대로된 값이 들어왔는지 확인
		await this.prismaService.chatMember.createMany({
			data : CreateChatMemberArray(newRoom['id'], socketUserId, attibute.MemberList)
		})//제대로된 값이 들어왔는지 확인
		this.sendData(ws, ChatOpCode.Create, newRoom);
	}

	private async EnterRoom(msgBuf : ByteBuffer, ws : ChatWebSocket)
	{
		const chatRoom = this.readData(msgBuf);
	}
}
