import { WebSocket } from "ws";

export class ChatSocket extends WebSocket {
	id : number;
	constructor(userId : number, address : string | URL, protocols : string | string[], options : object) {
		super(address, protocols, options);
		this.id = userId;
	}
}