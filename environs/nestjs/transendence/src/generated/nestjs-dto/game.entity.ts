
import {Prisma} from '@prisma/client'
import {GameMember} from './gameMember.entity'


export class Game {
  id: bigint ;
title: string ;
modeFlags: number ;
password: string ;
battlefield: number ;
timestamp: Date ;
statistic: Prisma.JsonValue ;
members?: GameMember[] ;
}
