
import {Prisma} from '@prisma/client'
import {Account} from './account.entity'


export class GameHistory {
  id: bigint ;
modeFlags: number ;
battlefield: number ;
timestamp: Date ;
statistic: Prisma.JsonValue ;
members?: Account[] ;
memberStatistics: Prisma.JsonValue ;
}
