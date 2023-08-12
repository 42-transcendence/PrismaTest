import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient

// enum pass {
// 	IN,
// 	OUT,
// 	INSIDE,
// 	OUTSIDE
// }

// interface Users {
// 	id : number,
// 	name : string,
// 	passMode : pass,
// 	timeStamp : Date,
// }

function remove(array: number[]) {
	array.splice(1, 1);
}

async function main() {
	const array: number[] = [1, 2, 3, 4];
	remove(array);
	console.log(array);
	// const user = await prisma.preference.deleteMany({
	// 	where: {
	// 		id: 1,
	// 		userId: { in: [1, 2] }
	// 	}
	// })

	// const user = await prisma.preference.findMany()
	// const user = await prisma.preference.findMany()
	// const users = new Map();
	// const arr = [1, 2, 3];
	// users.set('1a', 1).set('2b', 2).set('3b', 3);
	// console.log(user);
	// for (let user of users)
	// 	console.log(arr.includes(user[1]));
}


main().catch(e => {
	console.error(e.massage);
}).finally(async () => {
	await prisma.$disconnect()
})