import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { ChatWebSocket } from 'src/chat/utils/chatSocket';


@WebSocketGateway(8000)
export class NewChatService implements OnGatewayConnection, OnGatewayDisconnect {
	
	clients: Map<number, ChatWebSocket>;
    
	constructor() {
        this.clients = new Map();
    }


	
    public handleConnection(client : ChatWebSocket): void {
        console.log('hi');
        this.clients.set(1, client);
    }

    public handleDisconnect(client : ChatWebSocket): void {
        console.log('bye', client);
        this.clients.delete(1);
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: number) {
		// client.send(data.toString());
		console.log(data);
    }

    @SubscribeMessage('data')
    handleData(client : WebSocket, data: number) {
		client.send(data.toString());
		console.log(data);
    }
}
