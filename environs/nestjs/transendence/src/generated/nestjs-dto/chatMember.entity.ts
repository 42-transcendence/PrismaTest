
import {Chat} from './chat.entity'
import {Account} from './account.entity'


export class ChatMember {
  chat?: Chat ;
chatId: number ;
account?: Account ;
accountId: number ;
modeFlags: number ;
}
