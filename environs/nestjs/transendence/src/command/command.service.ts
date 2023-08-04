import { PrismaService } from "src/prisma.service";
import { ByteBuffer } from "libs/byte-buffer";
import authConfig from "src/config/authConfig";
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { ChatWebSocket } from "src/new-chat/chatSocket";
import { jwtVerifyHMAC } from "libs/jwt";
import { encodeUTF8 } from "libs/utf8";
import { CustomException } from "src/chat/utils/exception";
import { ChatMemberWithChatUuid, ChatMessageWithChatUuid, ChatRightCode, ChatRoomMode, ChatWithoutIdUuid, CreateChatMemberArray, RoomInfo, readChatAndMemebers, writeChat, writeRoominfo, wrtieChats } from "./commandUtils/utils";
import { ChatOpCode, ChatWithoutId } from "./commandUtils/utils";
import { ChatEntity, ChatMemberEntity } from "src/generated/model";


@Injectable()
export class CommandService {
	constructor(private prismaService: PrismaService, @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>) { }

	async LoadFriendList(client: client) {
		const friendList: { friendAccount: LoadFriendAttribute }[] = await this.prismaService.friend.findMany({
			where: {
				accountId: client.userId,
			},
			select: {
				friendAccount: {
					select: {
						id: true,
						nickName: true,
						nickTag: true,
						avatarKey: true,
						activeStatus: true,
						activeTimestamp: true,
						statusMessage: true,
					}
				},
			}
		})
		this.sendData(client.socket, ChatOpCode.LoadFriendsList, friendList);
	}

	async ChatServerConnect(buf: ByteBuffer, client: ChatWebSocket) {

		const result = await jwtVerifyHMAC(buf.readString(), 'HS256', encodeUTF8(this.config.jwtSecret));
		if (result.success) {
			const payload = result.payload;
			const buf = ByteBuffer.createWithOpcode(ChatOpCode.Connect);
			client.userId = Number(payload['userId']);

			client.send(buf.toArray());
		}
		else
			throw new CustomException('Connect Error');
	}

	async sendChat(client: ChatWebSocket) {
		const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Room);
		const roomList: { chat: ChatWithoutId }[] = await this.prismaService.chatMember.findMany({
			where: {
				accountId: client.userId,
			},
			select: {
				chat: true
			}
		});
		wrtieChats(roomList.length, buf, roomList);
		client.send(buf.toArray());
	}

	async createRoom(buf: ByteBuffer, client: ChatWebSocket, clients: Set<ChatWebSocket>) {
		const createInfo: { chat: ChatWithoutIdUuid, members: number[] } = readChatAndMemebers(buf)
		const newRoom: ChatEntity = await this.prismaService.chat.create({
			data: createInfo.chat,
		});
		await this.prismaService.chatMember.create({
			data: {
				chatId: newRoom.id,
				accountId: client.userId,
				modeFlags: ChatRightCode.Admin
			}
		})
		await this.prismaService.chatMember.createMany({
			data: CreateChatMemberArray(newRoom.id, createInfo.members),
		})

		const roomInfo: RoomInfo | null = await this.prismaService.chat.findUnique({
			where: {
				id: newRoom.id,
			},
			select: {
				uuid: true,
				title: true,
				modeFlags: true,
				password: true,
				limit: true,
				members: {
					select: {
						account: {
							select: {
								uuid: true,
								nickName: true,
								nickTag: true,
								avatarKey: true,
								activeStatus: true,
								activeTimestamp: true,
								statusMessage: true
							}
						},
						modeFlags: true
					}
				},
				messages: {
					select: {
						id: true,
						account: {
							select: {
								uuid: true
							}
						},
						content: true,
						modeFlags: true,
						timestamp: true
					}
				}
			}
		})
		const sendBuf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Create);
		if (roomInfo)
			writeRoominfo(sendBuf, roomInfo);
		else
			throw new CustomException('존재하지 않는 채팅방입니다.')
		createInfo.members.push(client.userId);
		for (let client of clients) {
			if (createInfo.members.includes(client.userId))
				client.send(sendBuf.toArray());
		}
	}

	async JoinRoom(msgBuf: ByteBuffer, client: client) {
		const RecievedChatRoom: Chat = JSON.parse(msgBuf.readString());
		const chatRoom = await this.prismaService.chat.findUnique({
			where: {
				id: RecievedChatRoom.id,
				title: RecievedChatRoom.title,
				modeFlags: RecievedChatRoom.modeFlags,
				password: RecievedChatRoom.password,
				limit: RecievedChatRoom.limit
			}
		});
		if (!chatRoom)
			throw new CustomException('Bad Access'); // 잘못된 비밀번호 혹은 잘못된 접근일때
		await this.prismaService.chatMember.create({
			data: {
				chatId: RecievedChatRoom.id,
				accountId: client.userId,
				modeFlags: ChatRightCode.Normal
			}
		})
		const sendMsg: ChatRoomInformation = await this.MakeChatRoomInformation(RecievedChatRoom);
		this.sendData(client.socket, ChatOpCode.Join, sendMsg);
	}

	async SearchPubilcRoom(ws: ChatWebSocket) {
		const publicRoom = await this.prismaService.chat.findMany({
			where: {
				OR: [
					{
						modeFlags: ChatRoomMode.PublicNoPass
					},
					{
						modeFlags: ChatRoomMode.PublicPass
					}
				]
			}
		});
		this.sendData(ws, ChatOpCode.PublicSearch, publicRoom)
	}

	// async PartRoom(msgBuf : ByteBuffer, client : client)
	// {


	// }
}