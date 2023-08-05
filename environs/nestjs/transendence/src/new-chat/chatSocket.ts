import { WebSocket } from "ws";
export class ChatWebSocket extends WebSocket {
	public userId: number = 0;
	public userUUID: string = '';
	public NowRoomId: number = 0;
}
