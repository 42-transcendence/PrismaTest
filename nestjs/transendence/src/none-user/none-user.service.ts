import { Injectable } from '@nestjs/common';

@Injectable()
export class NoneUserService {
	getHello() : string {
		return 'Hello World!'
	}
}
