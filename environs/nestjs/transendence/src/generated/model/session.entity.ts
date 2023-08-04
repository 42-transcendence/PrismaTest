
import {AccountEntity} from './account.entity'


export class SessionEntity {
  id: number ;
account?: AccountEntity ;
accountId: number ;
token: string ;
createdTimestamp: Date ;
successor?: SessionEntity  | null;
predecessor?: SessionEntity  | null;
predecessorId: number  | null;
isValid: boolean ;
}
