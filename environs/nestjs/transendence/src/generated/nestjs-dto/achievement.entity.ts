
import {Record} from './record.entity'


export class Achievement {
  record?: Record  | null;
accountId: number  | null;
achievementId: number ;
completedTimestamp: Date ;
}
