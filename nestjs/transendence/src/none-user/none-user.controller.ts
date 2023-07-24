import { Controller, Get, UseGuards } from '@nestjs/common';
// import { AuthGuard } from 'src/auth.guard';
import { NoneUserService } from './none-user.service';

// @UseGuards(AuthGuard)
@Controller('none')
export class NoneUserController {
	constructor(private readonly appService: NoneUserService) {}
	
	@Get('/get')
	getHello() : string
	{
		return "Hello Get World!"
	}

	// @UseGuards(AuthGuard)
	@Get()
	noneGetHello() : string
	{
		return this.appService.getHello();
	}
}
