
import {Prisma} from '@prisma/client'
import {GameEntity} from './game.entity'
import {AccountEntity} from './account.entity'


export class GameMemberEntity {
  game?: GameEntity ;
gameId: bigint ;
account?: AccountEntity ;
accountId: number ;
modeFlags: number ;
statistic: Prisma.JsonValue ;
}
