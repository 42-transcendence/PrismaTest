
import {Account} from './account.entity'


export class Device {
  id: number ;
fingerprint: string ;
createdTimestamp: Date ;
updatedTimestamp: Date ;
ipAddress: string ;
userAgent: string ;
accounts?: Account[] ;
gameAccount?: Account  | null;
}
