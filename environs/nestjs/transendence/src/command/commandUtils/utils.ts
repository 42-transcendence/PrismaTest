import { ByteBuffer } from "libs/byte-buffer";
import { $Enums, Prisma } from "@prisma/client";
import { ChatMemberEntity } from "src/generated/model";

export enum ChatOpCode {
	Connect,
	LoadFriendsList,
	Room,
	Create,
	Invite,
	Join,
	PublicSearch,
	Auth,
	Part,
	Chat,
}

export enum ChatRightCode {
	Admin,
	Manager,
	Normal
}

export enum ChatRoomMode {
	PublicPass,
	PublicNoPass,
	PrivatePass,
	PrivateNoPass,
}


export function CreateChatMemberArray(chatRoomId: number, memberList: number[]): ChatMemberEntity[] {
	const arr: ChatMemberEntity[] = [];
	for (let i of memberList)
		arr.push({ chatId: chatRoomId, accountId: i, modeFlags: ChatRightCode.Normal });
	return arr;
}

//chatWhitoutIdUuid

const chatWhitoutIdUuid = Prisma.validator<Prisma.ChatDefaultArgs>()({
	select: {
		title: true,
		modeFlags: true,
		password: true,
		limit: true
	},
});
export type ChatWithoutIdUuid = Prisma.ChatGetPayload<typeof chatWhitoutIdUuid>

export function writeChatAndMemebers(buf: ByteBuffer, room: ChatWithoutIdUuid, members: number[]): ByteBuffer {
	buf.write4Unsigned(room.modeFlags);
	buf.write4Unsigned(room.limit);
	buf.writeString(room.title);
	buf.writeString(room.password);
	buf.write2Unsigned(members.length);
	for (let member of members)
		buf.write4(member)
	return buf;
}

export function readChatAndMemebers(buf: ByteBuffer): { chat: ChatWithoutIdUuid, members: number[] } {
	const modeFlags = buf.read4Unsigned();
	const limit = buf.read4Unsigned();
	const title = buf.readString();
	const password = buf.readString();
	const membersSize = buf.read2Unsigned();
	const members: number[] = [];
	for (let i = 0; i < membersSize; ++i)
		members.push(buf.read4());
	return {
		chat: {
			modeFlags,
			limit,
			title,
			password,
		},
		members
	}
}

//chatWhitoutId

const chatWhitoutId = Prisma.validator<Prisma.ChatDefaultArgs>()({
	select: {
		uuid: true,
		title: true,
		modeFlags: true,
		password: true,
		limit: true
	},
});
export type ChatWithoutId = Prisma.ChatGetPayload<typeof chatWhitoutId>

export function writeChat(buf: ByteBuffer, room: ChatWithoutId): ByteBuffer {
	buf.writeString(room.uuid);
	buf.write4Unsigned(room.modeFlags);
	buf.write4Unsigned(room.limit);
	buf.writeString(room.title);
	buf.writeString(room.password);
	return buf;
}

export function wrtieChats(size: number, buf: ByteBuffer, rooms: { chat: ChatWithoutId }[]): ByteBuffer {
	buf.write2Unsigned(size);
	for (let room of rooms) {
		buf.writeString(room.chat.uuid);
		buf.write4Unsigned(room.chat.modeFlags);
		buf.write4Unsigned(room.chat.limit);
		buf.writeString(room.chat.title);
		buf.writeString(room.chat.password);
	}
	return buf;
}

export function readChat(buf: ByteBuffer): ChatWithoutId {
	const uuid = buf.readString();
	const modeFlags = buf.read4Unsigned();
	const limit = buf.read4Unsigned();
	const title = buf.readString();
	const password = buf.readString();
	return {
		uuid,
		modeFlags,
		limit,
		title,
		password,
	}
}

export function readChats(buf: ByteBuffer): ChatWithoutId[] {
	const size = buf.read2Unsigned();
	const rooms: ChatWithoutId[] = [];
	for (let i = 0; i < size; ++i) {
		rooms.push({
			uuid: buf.readString(),
			modeFlags: buf.read4Unsigned(),
			limit: buf.read4Unsigned(),
			title: buf.readString(),
			password: buf.readString()
		})
	}
	return rooms;
}

//chatMemberWithChatUuid

const chatMemberWithChatUuid = Prisma.validator<Prisma.ChatMemberDefaultArgs>()({
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
		modeFlags: true,
	}
});
export type ChatMemberWithChatUuid = Prisma.ChatMemberGetPayload<typeof chatMemberWithChatUuid>

export function writeChatMemberAccount(buf: ByteBuffer, member: ChatMemberWithChatUuid): ByteBuffer {
	buf.writeString(member.account.uuid);
	if (member.account.nickName) {
		buf.write1(1);
		buf.writeString(member.account.nickName);
	}
	else
		buf.write1(0);
	buf.write4Unsigned(member.account.nickTag);
	if (member.account.avatarKey) {
		buf.write1(1);
		buf.writeString(member.account.avatarKey)
	}
	else
		buf.write1(0);
	buf.writeString(member.account.activeStatus)
	buf.write8Unsigned(BigInt(member.account.activeTimestamp.getTime()));
	buf.writeString(member.account.statusMessage);
	buf.write4Unsigned(member.modeFlags);
	return buf;
}

export function writeChatMemberAccounts(buf: ByteBuffer, members: ChatMemberWithChatUuid[]): ByteBuffer {
	buf.write2Unsigned(members.length);
	for (let member of members) {
		buf.writeString(member.account.uuid);
		if (member.account.nickName) {
			buf.write1(1);
			buf.writeString(member.account.nickName);
		}
		else
			buf.write1(0);
		buf.write4Unsigned(member.account.nickTag);
		if (member.account.avatarKey) {
			buf.write1(1);
			buf.writeString(member.account.avatarKey)
		}
		else
			buf.write1(0);
		buf.writeString(member.account.activeStatus)
		buf.write8Unsigned(BigInt(member.account.activeTimestamp.getTime()));
		buf.writeString(member.account.statusMessage);
		buf.write4Unsigned(member.modeFlags);
	}
	return buf;
}

export function readChatMemberAccount(buf: ByteBuffer): ChatMemberWithChatUuid {
	const uuid = buf.readString();
	let nickName: string | null = null;
	if (buf.read1())
		nickName = buf.readString();
	const nickTag = buf.read4Unsigned();
	let avatarKey: string | null = null;
	if (buf.read1())
		avatarKey = buf.readString();
	const activeStatus = buf.readString() as $Enums.ActiveStatus;
	const activeTimestamp = new Date(Number(buf.read8Unsigned()));
	const statusMessage = buf.readString();
	const modeFlags = buf.read4Unsigned();
	return {
		account: {
			uuid,
			nickName,
			nickTag,
			avatarKey,
			activeStatus,
			activeTimestamp,
			statusMessage
		},
		modeFlags,
	}
}

export function readChatMemberAccounts(buf: ByteBuffer): ChatMemberWithChatUuid[] {
	const size = buf.read2Unsigned();
	const members: ChatMemberWithChatUuid[] = [];
	for (let i = 0; i < size; ++i) {
		const uuid = buf.readString();
		let nickName: string | null = null;
		if (buf.read1())
			nickName = buf.readString();
		const nickTag = buf.read4Unsigned();
		let avatarKey: string | null = null;
		if (buf.read1())
			avatarKey = buf.readString();
		const activeStatus = buf.readString() as $Enums.ActiveStatus;
		const activeTimestamp = new Date(Number(buf.read8Unsigned()));
		const statusMessage = buf.readString();
		const modeFlags = buf.read4Unsigned();
		const member: ChatMemberWithChatUuid = {
			account: {
				uuid,
				nickName,
				nickTag,
				avatarKey,
				activeStatus,
				activeTimestamp,
				statusMessage
			},
			modeFlags,
		}
		members.push(member);
	}
	return members;
}

//chatMessageWithChatUuid

const chatMessageWithChatUuid = Prisma.validator<Prisma.ChatMessageDefaultArgs>()({
	select: {
		id: true,
		account: {
			select: {
				uuid: true
			}
		},
		content: true,
		modeFlags: true,
		timestamp: true,
	}
});
export type ChatMessageWithChatUuid = Prisma.ChatMessageGetPayload<typeof chatMessageWithChatUuid>

export function writeChatMessage(buf: ByteBuffer, chatMessage: ChatMessageWithChatUuid): ByteBuffer {
	buf.write8Unsigned(chatMessage.id)
	buf.writeString(chatMessage.account.uuid);
	buf.write4Unsigned(chatMessage.modeFlags);
	buf.write8(BigInt(chatMessage.timestamp.getTime()));
	buf.writeString(chatMessage.content);
	return buf;
}

export function writeChatMessages(buf: ByteBuffer, chatMessages: ChatMessageWithChatUuid[]): ByteBuffer {
	buf.write2Unsigned(chatMessages.length);
	for (let chatMessage of chatMessages) {
		buf.write8Unsigned(chatMessage.id)
		buf.writeString(chatMessage.account.uuid);
		buf.write4Unsigned(chatMessage.modeFlags);
		buf.write8(BigInt(chatMessage.timestamp.getTime()));
		buf.writeString(chatMessage.content);
	}
	return buf;
}

export function readChatMessage(buf: ByteBuffer): ChatMessageWithChatUuid {
	const id = buf.read8Unsigned();
	const accountUuid = buf.readString();
	const modeFlags = buf.read4Unsigned();
	const timestamp = new Date(Number(buf.read8Unsigned()));
	const content = buf.readString();
	return {
		id,
		account: { uuid: accountUuid },
		modeFlags,
		timestamp,
		content
	}
}

export function readChatMessages(buf: ByteBuffer): ChatMessageWithChatUuid[] {
	const size = buf.read2Unsigned();
	const messages: ChatMessageWithChatUuid[] = [];
	for (let i = 0; i < size; ++i)
		messages.push({
			id: buf.read8Unsigned(),
			account: { uuid: buf.readString() },
			modeFlags: buf.read4Unsigned(),
			timestamp: new Date(Number(buf.read8Unsigned())),
			content: buf.readString(),
		})
	return messages;
}

//RoomInfo

export interface RoomInfo {
	uuid: string;
	title: string;
	modeFlags: number;
	password: string;
	limit: number;
	members: ChatMemberWithChatUuid[];
	messages: ChatMessageWithChatUuid[];
}
export function writeRoominfo(buf: ByteBuffer, roomInfo: RoomInfo): ByteBuffer {
	buf.writeString(roomInfo.uuid);
	buf.writeString(roomInfo.title);
	buf.write4Unsigned(roomInfo.modeFlags);
	buf.writeString(roomInfo.password);
	buf.write4Unsigned(roomInfo.limit);
	writeChatMemberAccounts(buf, roomInfo.members);
	writeChatMessages(buf, roomInfo.messages);
	return buf;
}

export function readRoominfo(buf: ByteBuffer): RoomInfo {
	const roomInfo: RoomInfo = {
		uuid: buf.readString(),
		title: buf.readString(),
		modeFlags: buf.read4Unsigned(),
		password: buf.readString(),
		limit: buf.read4Unsigned(),
		members: readChatMemberAccounts(buf,),
		messages: readChatMessages(buf,),
	}
	return roomInfo;
}