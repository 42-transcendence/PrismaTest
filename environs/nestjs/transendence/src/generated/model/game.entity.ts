
import {Prisma} from '@prisma/client'
import {GameMemberEntity} from './game-member.entity'


export class GameEntity {
  id: bigint ;
uuid: string ;
code: string ;
title: string ;
modeFlags: number ;
password: string ;
battlefield: number ;
timestamp: Date ;
statistic: Prisma.JsonValue ;
members?: GameMemberEntity[] ;
}
