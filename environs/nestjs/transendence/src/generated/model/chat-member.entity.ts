
import {ChatEntity} from './chat.entity'
import {AccountEntity} from './account.entity'
import {ChatMessageEntity} from './chat-message.entity'


export class ChatMemberEntity {
  chat?: ChatEntity ;
chatId: number ;
account?: AccountEntity ;
accountId: number ;
modeFlags: number ;
lastMessage?: ChatMessageEntity ;
lastMessageId: string ;
}
