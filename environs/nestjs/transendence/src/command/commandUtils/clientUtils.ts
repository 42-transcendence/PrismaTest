import { ByteBuffer } from "libs/byte-buffer";
import { ChatOpCode, ChatWithoutId, ChatWithoutIdUuid, RoomInfo, readChats, readRoominfo, writeChatAndMemebers, writeRoomJoinInfo, JoinCode, ChatMessageWithChatUuid, CreatCode, readChatMemberAccount, writeInviteMembers, readChat, AccountWithUuid, readAccountWithUuids, PartCode } from "./utils";
import { CustomException } from "src/command/commandUtils/exception";

export function sendConnectMessage(client: WebSocket) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Connect);
	const jwt = window.localStorage.getItem('jwt');
	if (jwt)
		buf.writeString(jwt);
	else
		throw new CustomException('로그인 상태가 아닙니다.')
	client.send(buf.toArray());
}

export function sendCreateRoom(client: WebSocket, room: ChatWithoutIdUuid, members: number[]) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Create);
	writeChatAndMemebers(buf, room, members);
	client.send(buf.toArray());
}

export function snedJoinRoom(client: WebSocket, room: { uuid: string, password: string }) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Join)
	writeRoomJoinInfo(buf, room);
	client.send(buf.toArray())
}

export function sendInvite(client: WebSocket, invitation: { chatUUID: string, members: number[] }) {
	//초대권한이 있는지 확인해함.
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Invite);
	writeInviteMembers(buf, invitation);
	client.send(buf.toArray());
}

export function sendEnter(client: WebSocket, roomUUID: string) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Enter);
	buf.writeString(roomUUID);
	client.send(buf.toArray());
}

export function sendPart(client: WebSocket, roomUUID: string) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Part);
	buf.writeString(roomUUID);
	client.send(buf.toArray());
}

//utils
function addRoomList(room: RoomInfo) {
	const message: ChatMessageWithChatUuid[] = [];
	if (room.messages)
		message.push(room.messages[0]);
	const addRoom: ChatWithoutId = {
		uuid: room.uuid,
		title: room.title,
		modeFlags: room.modeFlags,
		password: room.password,
		limit: room.limit,
		_count: { members: room.members.length },
		messages: message,
	}
	const rooms = JSON.parse(String(window.localStorage.getItem('rooms')));
	rooms.push(addRoom);
	window.localStorage.setItem('rooms', JSON.stringify(rooms));
}

//accept
export function connect(client: WebSocket) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Rooms);
	client.send(buf.toArray());
}

export function acceptRoom(client: WebSocket, buf: ByteBuffer) {
	const rooms: ChatWithoutId[] = readChats(buf);
	window.localStorage.setItem('rooms', JSON.stringify(rooms));
	const sendBuf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Friends)
	client.send(sendBuf.toArray())
}
export function acceptCreat(buf: ByteBuffer) {
	const code = buf.read1();
	const nowRoomInfo: RoomInfo = readRoominfo(buf);
	addRoomList(nowRoomInfo);
	if (code == CreatCode.Creater)
		window.localStorage.setItem('nowChatInfo', JSON.stringify(nowRoomInfo));
}

export function accpetJoin(buf: ByteBuffer) {
	const code = buf.read1();
	if (code == JoinCode.Reject)
		return;
	else if (code == JoinCode.Accept) {
		const roomInfo = readRoominfo(buf);
		addRoomList(roomInfo);
		window.localStorage.setItem('nowChatInfo', JSON.stringify(roomInfo));

	}
	else if (code == JoinCode.NewJoin) {
		const uuid = buf.readString();
		const member = readChatMemberAccount(buf);
		const nowRoom: RoomInfo = JSON.parse(String(window.localStorage.getItem('nowChatInfo')));
		if (nowRoom.uuid == uuid) {
			nowRoom.members.push(member);
			window.localStorage.setItem('nowChatInfo', JSON.stringify(nowRoom));
		}
		const rooms: ChatWithoutId[] = JSON.parse(String(window.localStorage.getItem('rooms')));
		for (let room of rooms) {
			if (room.uuid == uuid) {
				++room._count.members;
				break;
			}
		}
		window.localStorage.setItem('rooms', JSON.stringify(rooms));
	}
}

export function accpetPublicSearch(buf: ByteBuffer) {
	const publicRooms: ChatWithoutId[] = readChats(buf);
	publicRooms;
	return;
}

export function accpetInvite(buf: ByteBuffer) {
	const nowRoom: ChatWithoutId = readChat(buf);
	const rooms = JSON.parse(String(window.localStorage.getItem('rooms')));
	rooms.push(nowRoom);
	window.localStorage.setItem('rooms', JSON.stringify(rooms));
}

export function acceptFriends(buf: ByteBuffer) {
	const friends: AccountWithUuid[] = readAccountWithUuids(buf);
	window.localStorage.setItem('friends', JSON.stringify(friends));
}

export function acceptEnter(buf: ByteBuffer) {
	const roominfo: RoomInfo = readRoominfo(buf);
	window.localStorage.setItem('nowChatInfo', JSON.stringify(roominfo));
}

export function acceptPart(buf: ByteBuffer) {
	const code = buf.read1();
	const roomUUID = buf.readString();
	const nowRoom: RoomInfo = JSON.parse(String(window.localStorage.getItem('nowChatInfo')));
	const rooms: ChatWithoutId[] = JSON.parse(String(window.localStorage.getItem('nowChatInfo')));
	if (code == PartCode.Accept) {
		if (nowRoom.uuid == roomUUID) {
			window.localStorage.setItem('nowChatInfo', JSON.stringify(null));
		}
	}
}

export function acceptChatOpCode(buf: ByteBuffer, client: WebSocket) {
	const code: ChatOpCode = buf.readOpcode();

	if (code == ChatOpCode.Connect)
		connect(client);
	else if (code == ChatOpCode.Rooms)
		acceptRoom(client, buf);
	else if (code == ChatOpCode.Friends)
		acceptFriends(buf);
	else if (code == ChatOpCode.Join)
		accpetJoin(buf);
	else if (code == ChatOpCode.PublicSearch)
		accpetPublicSearch(buf);
	else if (code == ChatOpCode.Invite)
		accpetInvite(buf);
	else if (code == ChatOpCode.Enter)
		acceptEnter(buf);
	else if (code == ChatOpCode.Part)
		acceptPart(buf);
}