import { WebSocket } from "ws";
export class ChatWebSocket extends WebSocket {
	public userid : number = 0;
	public NowRoomId : number = 0;
}
