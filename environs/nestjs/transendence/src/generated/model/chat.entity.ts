
import {ChatMemberEntity} from './chat-member.entity'
import {ChatMessageEntity} from './chat-message.entity'


export class ChatEntity {
  id: number ;
uuid: string ;
title: string ;
modeFlags: number ;
password: string ;
limit: number ;
members?: ChatMemberEntity[] ;
messages?: ChatMessageEntity[] ;
}
