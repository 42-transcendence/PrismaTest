
import {RegistrationState,Role,ActiveStatus} from '@prisma/client'
import {RecordEntity} from './record.entity'
import {SessionEntity} from './session.entity'
import {DeviceEntity} from './device.entity'
import {FriendEntity} from './friend.entity'
import {EnemyEntity} from './enemy.entity'
import {BanEntity} from './ban.entity'
import {ChatMemberEntity} from './chat-member.entity'
import {ChatMessageEntity} from './chat-message.entity'
import {ChatBanEntity} from './chat-ban.entity'
import {GameQueueEntity} from './game-queue.entity'
import {GameMemberEntity} from './game-member.entity'
import {GameHistoryEntity} from './game-history.entity'


export class AccountEntity {
  id: number ;
uuid: string ;
authIssuer: number ;
authSubject: string ;
otpSecret: string  | null;
createdTimestamp: Date ;
changedTimestamp: Date ;
registrationState: RegistrationState ;
nickName: string  | null;
nickTag: number ;
avatarKey: string  | null;
role: Role ;
record?: RecordEntity  | null;
activeStatus: ActiveStatus ;
activeTimestamp: Date ;
statusMessage: string ;
sessions?: SessionEntity[] ;
devices?: DeviceEntity[] ;
friends?: FriendEntity[] ;
friendReferences?: FriendEntity[] ;
enemies?: EnemyEntity[] ;
enemyReferences?: EnemyEntity[] ;
bans?: BanEntity[] ;
managedBanTargets?: BanEntity[] ;
chatRooms?: ChatMemberEntity[] ;
chatMessages?: ChatMessageEntity[] ;
chatBans?: ChatBanEntity[] ;
managedChatBanTargets?: ChatBanEntity[] ;
gameQueue?: GameQueueEntity  | null;
gameMember?: GameMemberEntity  | null;
gameHistory?: GameHistoryEntity[] ;
currentGameDevice?: DeviceEntity  | null;
currentGameDeviceId: number  | null;
}
