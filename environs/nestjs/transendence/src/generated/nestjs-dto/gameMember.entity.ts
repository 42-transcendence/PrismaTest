
import {Prisma} from '@prisma/client'
import {Game} from './game.entity'
import {Account} from './account.entity'


export class GameMember {
  game?: Game ;
gameId: bigint ;
account?: Account ;
accountId: number ;
modeFlags: number ;
statistic: Prisma.JsonValue ;
}
