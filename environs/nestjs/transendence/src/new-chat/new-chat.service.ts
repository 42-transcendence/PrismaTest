import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer as IsWebSocketServer,
  OnGatewayConnection, OnGatewayDisconnect
} from "@nestjs/websockets";
// import { from, Observable } from "rxjs";
// import { map } from "rxjs/operators";
import { ByteBuffer } from "libs/byte-buffer";
import { WebSocketServer } from "ws";
import { ChatWebSocket } from 'src/new-chat/chatSocket';
import { CommandService } from "src/command/command.service";


enum ChatOpCode {
  Connect,
  LoadFriendsList,
  Create,
  Invite,
  Join,
  PublicSearch,
  Auth,
  Part,
  Chat,
}

@WebSocketGateway({
  // path: "event",
  WebSocket: ChatWebSocket
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @IsWebSocketServer()
  server: WebSocketServer;

  private clients: Set<ChatWebSocket>;

  constructor(private commandService: CommandService) {
    this.clients = new Set();
  }

  public handleConnection(client: ChatWebSocket) {
    this.clients.add(client);
  }

  public handleDisconnect(client: ChatWebSocket): void {
    this.clients.delete(client);
  }



  @SubscribeMessage(ChatOpCode.Connect)
  async Connection(client: ChatWebSocket, data: ByteBuffer): Promise<ByteBuffer> {
    await this.commandService.ChatServerConnect(data, client);
    return data;
  }
}

