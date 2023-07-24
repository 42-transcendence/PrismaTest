import { Body, Controller, DefaultValuePipe, Get, Headers, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { UserInfo } from './UserInfo';
import { User } from '@prisma/client';
import { privateDecrypt } from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService,
				private authService: AuthService) {}

	// @Post()
	// async CreateUser(@Body() dto: CreateUserDto) : Promise<void> {
	// 	const { name, email, password} = dto;
	// 	await this.usersService.Creat(name, email, password);
	// }

	@Get()
	async FindALL() : Promise<User[]> {
		console.log(process.env)
		return await this.usersService.FindAll();
	}


	@Post()
	async createUser(@Body() dto: CreateUserDto) : Promise<void> {
		const { name, email, password} = dto;
		await this.usersService.createUser(name, email, password);
	}

	@Get('/email-verify')
	async verifyEmail(@Query() dto: VerifyEmailDto) : Promise<string>
	{
		const { signupVerifyToken } = dto;
		return await this.usersService.verifyEmail(signupVerifyToken);
	}

	@Post('/login')
	async login(@Body() dto: UserLoginDto) : Promise<string> {
		const { email, password } = dto;
		return await this.usersService.login(email, password);
	}

	// @Get('/:id')
	// async getUserInfo(@Param('id') UserId: string) : Promise<UserInfo> {
	// 	return await this.usersService.getUserInfo(UserId);
	// }

	// @Get('/:id')
	// findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) : string {
	// 	return `${id}`;
	// }
	
	// @Get()
	// findALL(@Query('offset', new DefaultValuePipe(0)) offset : number, 
	// 		@Query('limit', new DefaultValuePipe(10)) limit : number) : string {
	// 	return `${offset}, ${limit}`;
	// }

	// @Get()
	// gethello(): string {
	// 	console.log("im in")
	// 	console.log('process.env : ', process.env);
	// 	return process.env.DATABASE_HOST;
	// }

	@UseGuards(AuthGuard)
	@Get(':id')
  	async getUserInfo(@Headers() headers: any, @Param('id') userId: number): Promise<UserInfo> {
    	return this.usersService.getUserInfo(userId);
	}
}
