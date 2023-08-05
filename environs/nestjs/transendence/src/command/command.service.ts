import { PrismaService } from "src/prisma.service";
import { ByteBuffer } from "libs/byte-buffer";
import authConfig from "src/config/authConfig";
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { ChatWebSocket } from "src/new-chat/chatSocket";
import { jwtVerifyHMAC } from "libs/jwt";
import { encodeUTF8 } from "libs/utf8";
import { CustomException } from "src/command/commandUtils/exception";
import { AccountWithUuid, ChatRightCode, ChatRoomMode, ChatWithoutIdUuid, CreatCode, CreateChatMemberArray, RoomInfo, readChatAndMemebers, readInviteMembers, readRoomJoinInfo, writeChatMemberAccount, writeRoominfo, writeChat, wrtieChats, writeAccountWithUuids } from "./commandUtils/utils";
import { ChatOpCode, ChatWithoutId, JoinCode } from "./commandUtils/utils";
import { ChatEntity } from "src/generated/model";


@Injectable()
export class CommandService {
	constructor(private prismaService: PrismaService, @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>) { }

	async chatServerConnect(buf: ByteBuffer, client: ChatWebSocket) {

		const result = await jwtVerifyHMAC(buf.readString(), 'HS256', encodeUTF8(this.config.jwtSecret));
		if (result.success) {
			const payload = result.payload;
			const buf = ByteBuffer.createWithOpcode(ChatOpCode.Connect);
			client.userId = Number(payload['userId']);
			client.userUUID = String(payload['userUUID']);

			client.send(buf.toArray());
		}
		else
			throw new CustomException('Connect Error');
	}

	async sendChat(client: ChatWebSocket) {
		const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Rooms);
		const chatList: ChatWithoutId[] = [];
		const roomList: { chat: ChatWithoutId }[] = await this.prismaService.chatMember.findMany({
			where: {
				accountId: client.userId,
			},
			select: {
				chat: {
					select: {
						uuid: true,
						title: true,
						modeFlags: true,
						password: true,
						limit: true,
						_count: {
							select: {
								members: true
							}
						},
						messages: {
							select: {
								id: true,
								content: true,
								timestamp: true,
								modeFlags: true,
								account: {
									select: {
										uuid: true,
									}
								}
							},
							orderBy: {
								id: 'desc'
							},
							take: 1
						}
					}
				}
			}
		});
		for (let room of roomList)
			chatList.push(room.chat);
		wrtieChats(buf, chatList);
		client.send(buf.toArray());
	}

	async sendFriends(client: ChatWebSocket) {
		const friendList: { friendAccount: AccountWithUuid }[] = await this.prismaService.friend.findMany({
			where: {
				accountId: client.userId
			},
			select: {
				friendAccount: {
					select: {
						uuid: true,
						nickName: true,
						nickTag: true,
						avatarKey: true,
						activeStatus: true,
						activeTimestamp: true,
						statusMessage: true
					}
				}
			}
		});
		const friends: AccountWithUuid[] = [];
		for (let friend of friendList)
			friends.push(friend.friendAccount);
		const buf = ByteBuffer.createWithOpcode(ChatOpCode.Friends);
		writeAccountWithUuids(buf, friends);
	}

	async createRoom(buf: ByteBuffer, client: ChatWebSocket, clients: Set<ChatWebSocket>) {
		const createInfo: { chat: ChatWithoutIdUuid, members: number[] } = readChatAndMemebers(buf)
		const newRoom: ChatEntity = await this.prismaService.chat.create({
			data: createInfo.chat,
		});
		//room & chatMemberCreate
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

		//roomInformation추출
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
			}
		})
		//Creater와 Inviter에게 roomInformation 전달
		const sendCreaterBuf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Create);
		const sendInivterBuf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Create);
		sendCreaterBuf.write1(CreatCode.Creater);
		sendInivterBuf.write1(CreatCode.Inviter);
		if (roomInfo) {
			writeRoominfo(sendCreaterBuf, roomInfo);
			writeRoominfo(sendInivterBuf, roomInfo);
		}
		else
			throw new CustomException('존재하지 않는 채팅방입니다.')
		client.send(sendCreaterBuf.toArray());
		for (let otherClient of clients) {
			if (createInfo.members.includes(otherClient.userId))
				otherClient.send(sendInivterBuf.toArray());
		}
	}

	async joinRoom(buf: ByteBuffer, client: ChatWebSocket, clients: Set<ChatWebSocket>) {
		const roomJoinInfo: { uuid: string, password: string } = readRoomJoinInfo(buf);
		const chatRoom = await this.prismaService.chat.findUnique({
			where: {
				uuid: roomJoinInfo.uuid,
			}
		});
		//Reject
		if (!chatRoom)
			throw new CustomException('채팅방이 존재하지 않습니다.')
		else if (chatRoom.password != roomJoinInfo.password) {
			const sendRejectBuf = ByteBuffer.createWithOpcode(ChatOpCode.Join);
			sendRejectBuf.write1(JoinCode.Reject);
			client.send(sendRejectBuf.toArray());
			return;
		}
		//chatMember create
		await this.prismaService.chatMember.create({
			data: {
				chatId: chatRoom.id,
				accountId: client.userId,
				modeFlags: ChatRightCode.Normal
			}
		})
		//RoomInfo find
		const roomInfo: RoomInfo | null = await this.prismaService.chat.findUnique({
			where: {
				id: chatRoom.id,
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
					},
					orderBy: {
						id: 'desc'
					}
				}
			}
		});
		//Accept
		const sendAcceptBuf = ByteBuffer.createWithOpcode(ChatOpCode.Join);
		sendAcceptBuf.write1(JoinCode.Accept);
		if (roomInfo)
			writeRoominfo(sendAcceptBuf, roomInfo);
		else
			throw new CustomException('채팅방이 존재하지 않습니다.');
		client.send(sendAcceptBuf.toArray());
		//NewJoin
		const sendNewJoinBuf = ByteBuffer.createWithOpcode(ChatOpCode.Join);
		sendAcceptBuf.write1(JoinCode.NewJoin);
		sendAcceptBuf.writeString(chatRoom.uuid);
		const otherMembers: string[] = []
		for (let member of roomInfo.members) {
			if (member.account.uuid == client.userUUID) {
				writeChatMemberAccount(sendNewJoinBuf, member);
			}
			else {
				otherMembers.push(member.account.uuid);
			}
		}
		for (let otherClinet of clients)
			if (otherMembers.includes(otherClinet.userUUID))
				otherClinet.send(sendNewJoinBuf.toArray());
	}

	async searchPubilcRoom(client: ChatWebSocket) {
		const publicRooms: ChatWithoutId[] = await this.prismaService.chat.findMany({
			where: {
				OR: [
					{
						modeFlags: ChatRoomMode.PublicNoPass
					},
					{
						modeFlags: ChatRoomMode.PublicPass
					}
				]
			},
			select: {
				uuid: true,
				title: true,
				modeFlags: true,
				password: true,
				limit: true,
				_count: {
					select: {
						members: true
					}
				},
				messages: {
					select: {
						id: true,
						content: true,
						timestamp: true,
						modeFlags: true,
						account: {
							select: {
								uuid: true,
							}
						}
					},
					orderBy: {
						id: 'desc'
					},
					take: 1
				}
			}
		});
		const buf = ByteBuffer.createWithOpcode(ChatOpCode.PublicSearch);
		wrtieChats(buf, publicRooms);
		client.send(buf.toArray());
	}

	async invite(client: ChatWebSocket, clients: Set<ChatWebSocket>, buf: ByteBuffer) {
		const invitation: { chatUUID: string, members: number[] } = readInviteMembers(buf);
		//권한이 없으면 초대 거부
		const room = await this.prismaService.chat.findUnique({
			where: {
				uuid: invitation.chatUUID
			},
			select:
			{
				id: true,
				members: {
					where: {
						accountId: client.userId,
					},
					select: {
						modeFlags: true,
					},
				}
			}
		})
		if (!room)
			throw new CustomException('채팅방이 존재하지 않습니다.');
		if (room.members[0].modeFlags == ChatRightCode.Normal)
			throw new CustomException('초대 권한이 없습니다.');
		//chatMember add
		await this.prismaService.chatMember.createMany({
			data: CreateChatMemberArray(room?.id, invitation.members)
		});
		//roomInformation추출
		const roomInfo: ChatWithoutId | null = await this.prismaService.chat.findUnique({
			where: {
				uuid: invitation.chatUUID,
			},
			select: {
				uuid: true,
				title: true,
				modeFlags: true,
				password: true,
				limit: true,
				_count: {
					select: {
						members: true,
					}
				},
				messages: {
					select: {
						id: true,
						account: {
							select: {
								uuid: true,
							}
						},
						content: true,
						timestamp: true,
						modeFlags: true,
					},
					orderBy: {
						id: 'desc'
					},
					take: 1
				}
			},
		});
		const sendBuf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Invite);
		if (roomInfo) {
			writeChat(sendBuf, roomInfo);
		}
		else
			throw new CustomException('존재하지 않는 채팅방입니다.')
		for (let otherClient of clients) {
			if (invitation.members.includes(otherClient.userId))
				otherClient.send(sendBuf.toArray());
		}
	}
	// async PartRoom(msgBuf : ByteBuffer, client : client)
	// {


	// }
}