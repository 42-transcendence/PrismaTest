
import {Prisma} from '@prisma/client'
import {AccountEntity} from './account.entity'


export class GameHistoryEntity {
  id: bigint ;
uuid: string ;
modeFlags: number ;
battlefield: number ;
timestamp: Date ;
statistic: Prisma.JsonValue ;
members?: AccountEntity[] ;
memberStatistics: Prisma.JsonValue ;
}
