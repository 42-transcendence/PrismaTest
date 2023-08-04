
import {AccountEntity} from './account.entity'


export class DeviceEntity {
  id: number ;
fingerprint: string ;
createdTimestamp: Date ;
updatedTimestamp: Date ;
ipAddress: string ;
userAgent: string ;
accounts?: AccountEntity[] ;
gameAccount?: AccountEntity  | null;
}
