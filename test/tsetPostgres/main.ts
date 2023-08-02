import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient


interface abc {
	name : string;
	age : number;
}

async function main() {
	const list : abc[] = [];
	for (let i = 0 ; i < 10 ; ++i)
		list.push({name : `${i}a`, age : i});
	console.log(list);
}


main().catch(e => {
	console.error(e.massage);
}).finally(async () => {
	await prisma.$disconnect()})