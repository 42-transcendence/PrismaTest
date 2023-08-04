
import {Chat} from './chat.entity'
import {Account} from './account.entity'


export class ChatMessage {
  id: bigint ;
chat?: Chat ;
chatId: number ;
account?: Account ;
accountId: number ;
content: string ;
modeFlags: number ;
timestamp: Date ;
}
