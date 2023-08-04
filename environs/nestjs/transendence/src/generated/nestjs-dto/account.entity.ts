
import {RegistrationState,Role,ActiveStatus} from '@prisma/client'
import {Record} from './record.entity'
import {Session} from './session.entity'
import {Device} from './device.entity'
import {Friend} from './friend.entity'
import {Enemy} from './enemy.entity'
import {Ban} from './ban.entity'
import {ChatMember} from './chatMember.entity'
import {ChatMessage} from './chatMessage.entity'
import {ChatBan} from './chatBan.entity'
import {GameQueue} from './gameQueue.entity'
import {GameMember} from './gameMember.entity'
import {GameHistory} from './gameHistory.entity'


export class Account {
  id: number ;
idIssuer: number ;
idSubject: string ;
otpSecret: string  | null;
createdTimestamp: Date ;
changedTimestamp: Date ;
registrationState: RegistrationState ;
nickName: string  | null;
nickTag: number ;
avatarKey: string  | null;
role: Role ;
record?: Record  | null;
activeStatus: ActiveStatus ;
activeTimestamp: Date ;
statusMessage: string ;
sessions?: Session[] ;
devices?: Device[] ;
friends?: Friend[] ;
friendReferences?: Friend[] ;
enemies?: Enemy[] ;
enemyReferences?: Enemy[] ;
bans?: Ban[] ;
managedBanTargets?: Ban[] ;
chatRooms?: ChatMember[] ;
chatMessages?: ChatMessage[] ;
chatBans?: ChatBan[] ;
managedChatBanTargets?: ChatBan[] ;
gameQueue?: GameQueue  | null;
gameMember?: GameMember  | null;
gameHistory?: GameHistory[] ;
currentGameDevice?: Device  | null;
currentGameDeviceId: number  | null;
}
