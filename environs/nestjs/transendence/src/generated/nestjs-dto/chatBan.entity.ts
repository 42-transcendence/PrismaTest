
import {Account} from './account.entity'


export class ChatBan {
  id: number ;
account?: Account ;
accountId: number ;
managerAccount?: Account ;
managerAccountId: number ;
reason: string ;
memo: string ;
expireTimestamp: Date  | null;
bannedTimestamp: Date ;
}
