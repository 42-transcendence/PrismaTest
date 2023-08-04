
import {Prisma} from '@prisma/client'
import {Account} from './account.entity'
import {Achievement} from './achievement.entity'


export class Record {
  account?: Account ;
accountId: number ;
achievements?: Achievement[] ;
skillRating: number ;
winCount: number ;
loseCount: number ;
tieCount: number ;
gameStatistics: Prisma.JsonValue ;
}
