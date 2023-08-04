
import {AccountEntity} from './account.entity'


export class ChatBanEntity {
  id: number ;
account?: AccountEntity ;
accountId: number ;
managerAccount?: AccountEntity ;
managerAccountId: number ;
reason: string ;
memo: string ;
expireTimestamp: Date  | null;
bannedTimestamp: Date ;
}
