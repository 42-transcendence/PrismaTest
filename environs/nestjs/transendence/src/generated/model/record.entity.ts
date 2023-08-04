
import {Prisma} from '@prisma/client'
import {AccountEntity} from './account.entity'
import {AchievementEntity} from './achievement.entity'


export class RecordEntity {
  account?: AccountEntity ;
accountId: number ;
achievements?: AchievementEntity[] ;
skillRating: number ;
winCount: number ;
loseCount: number ;
tieCount: number ;
gameStatistics: Prisma.JsonValue ;
}
