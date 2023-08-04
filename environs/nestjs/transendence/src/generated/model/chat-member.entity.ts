
import {ChatEntity} from './chat.entity'
import {AccountEntity} from './account.entity'


export class ChatMemberEntity {
  chat?: ChatEntity ;
chatId: number ;
account?: AccountEntity ;
accountId: number ;
modeFlags: number ;
}
