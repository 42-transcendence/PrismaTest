import * as uuid from 'uuid';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { PrismaService } from 'src/prisma.service';
import { NotFoundError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor (private emailService: EmailService, private userRepository : PrismaService, private authService: AuthService) {}

	async createUser(name: string, email: string, password: string) {
		const userExist = await this.checkUserExists(email)
		if (userExist)
		{
			throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
		}
		
		const signupVerifyToken = uuid.v1();
		
		await this.saveUser(name, email, password, signupVerifyToken);
		await this.sendMemberJoinEmail(email, signupVerifyToken);
	}

	private async checkUserExists(email : string) : Promise<boolean>
	{
		const user = await this.userRepository.user.findUnique({
			where: {
				email: String(email),
			},
		})
		return user !== null;
	}

	private async saveUser(name: string, email: string, password: string, signupVerifyToken: string)
	{
		const user = await this.userRepository.user.create({
			data : {
				name: name,
				email: email,
				password: password,
				signupVerifyToken: signupVerifyToken,
			}
		})
	}

	private async sendMemberJoinEmail(email : string, signupVerifyToken: string)
	{
		await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
	}

	async verifyEmail(signupVerifyToken: string): Promise<string> {
		const user = await this.userRepository.user.findUnique({
			where: { 
				signupVerifyToken: signupVerifyToken
			}
		})

		console.log(await this.userRepository.user.findMany());

		if (!user)
			throw new NotFoundException('유저가 존재하지 않습니다.')
		return this.authService.login({
			id: user.id,
			name: user.name,
			email: user.email,
		})
	}

	async login(email: string, password: string): Promise<string> {
		const user = await this.userRepository.user.findUnique({
			where: {
				email: email,
				password: password
			}
		});

		if (!user) {
			throw new NotFoundException('유저가 존재하지 않습니다.');
		}

		return this.authService.login({
			id: user.id,
			name: user.name,
			email: user.email
		});
	}

	async getUserInfo(UserId: number): Promise<UserInfo> {
		const user = await this.userRepository.user.findUnique({
			where: {
				id: UserId,
			}
		});

		if (!user)
			throw new NotFoundException('유저가 존재하지 않습니다.');
		
		return {
			id: user.id,
			name: user.name,
			email: user.email
		};
		
	}

	// async Creat(name: string, email: string, password: string) {
	// 	const user = this.userRepository.user.create({
	// 		data : {
	// 			name: name,
	// 			email: email,
	// 			password: password,
	// 			signupVerifyToken: "12345",
	// 		}
	// 	})
	// }

	async FindAll() : Promise<User[]> {
		const user = await this.userRepository.user.findMany();
		return user;
	}
}