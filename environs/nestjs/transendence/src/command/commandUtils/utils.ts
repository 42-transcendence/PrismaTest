
export enum ChatRightCode {
	Admin,
	Manager,
	Normal
}

export enum ChatRoomMode {
	Public,
	Private
}

export interface RoomCreateDTO {
	RoomAttibutes : {
		title : string,
		modeFlags : number,
		password : string,
		limit : number
	};
	MemberList : number[];
}

export interface ChatMember {
	chatId : number;
	accountId : number;
	modeFlags : number;
}

export interface Chat {
	id : number;
	title : string;
	modeFlags : number;
	limit : number; 
}


export function CreateChatMemberArray(ChatRoomId : number, createUserId : number, MemberList : number[]) : ChatMember[] {
	const arr : ChatMember[] = [{chatId : ChatRoomId, accountId : createUserId, modeFlags : ChatRightCode.Admin}];
	for (let i of MemberList)
		arr.push({chatId : ChatRoomId, accountId : i, modeFlags : ChatRightCode.Normal});
	return arr;
}