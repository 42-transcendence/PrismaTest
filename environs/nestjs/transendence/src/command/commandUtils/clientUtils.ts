import { ByteBuffer } from "libs/byte-buffer";
import { ChatOpCode, ChatWithoutId, ChatWithoutIdUuid, readChats, writeChatAndMemebers } from "./utils";
import { CustomException } from "src/chat/utils/exception";

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

//accept
export function connect(client: WebSocket) {
	const buf: ByteBuffer = ByteBuffer.createWithOpcode(ChatOpCode.Room);
	client.send(buf.toArray());
}

export function acceptRoom(buf: ByteBuffer) {
	const rooms: ChatWithoutId[] = readChats(buf);
	window.localStorage.setItem('rooms', JSON.stringify(rooms));
}

export function acceptChatOpCode(buf: ByteBuffer, client: WebSocket) {
	const code: ChatOpCode = buf.read2Unsigned();

	if (code == ChatOpCode.Connect)
		connect(client);
	else if (code == ChatOpCode.Room)
		acceptRoom(buf);
}