import { WebSocket } from "ws";

export class ChatSocket extends WebSocket {
	constructor(private userId : number, address : string | URL, protocols : string | string[], options : object) {
		super(address, protocols, options);
	}

	getUserid() : number {
		return this.userId;
	}
}