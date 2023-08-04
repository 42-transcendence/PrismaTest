
import {Account} from './account.entity'


export class Session {
  id: string ;
account?: Account ;
accountId: number ;
token: string ;
createdTimestamp: Date ;
successor?: Session  | null;
predecessor?: Session  | null;
predecessorId: string  | null;
isValid: boolean ;
}
