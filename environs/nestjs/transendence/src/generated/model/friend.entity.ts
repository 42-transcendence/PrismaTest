
import {AccountEntity} from './account.entity'


export class FriendEntity {
  account?: AccountEntity ;
accountId: number ;
friendAccount?: AccountEntity ;
friendAccountId: number ;
groupName: string ;
activeFlags: number ;
}
