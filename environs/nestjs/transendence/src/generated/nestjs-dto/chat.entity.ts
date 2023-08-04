
import {ChatMember} from './chatMember.entity'
import {ChatMessage} from './chatMessage.entity'


export class Chat {
  id: number ;
title: string ;
modeFlags: number ;
password: string ;
limit: number ;
members?: ChatMember[] ;
messages?: ChatMessage[] ;
}
