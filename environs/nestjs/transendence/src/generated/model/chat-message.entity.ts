
import {ChatEntity} from './chat.entity'
import {AccountEntity} from './account.entity'


export class ChatMessageEntity {
  uuid: string ;
chat?: ChatEntity ;
chatId: number ;
account?: AccountEntity ;
accountId: number ;
content: string ;
modeFlags: number ;
timestamp: Date ;
}
