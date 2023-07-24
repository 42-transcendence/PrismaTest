import { NoneUserService } from './none-user.service';
export declare class NoneUserController {
    private readonly appService;
    constructor(appService: NoneUserService);
    getHello(): string;
    noneGetHello(): string;
}
