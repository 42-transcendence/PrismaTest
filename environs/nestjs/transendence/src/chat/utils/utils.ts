import { ByteBuffer } from "./byte-buffer";
import { WebSocket } from 'ws';

enum ChatOpCode {
	Auth,
	Join,
	Part,
	Create,
	Chat,
	Enter,
}

export function command(msg : Uint8Array, ws : WebSocket) : string
{
	const msgBuf : ByteBuffer = ByteBuffer.from(msg);
	const code : number = msgBuf.read1();
	if (code === ChatOpCode.Auth)
		ChatServerEnter();
	return 'error';
}

function ChatServerEnter() {

}