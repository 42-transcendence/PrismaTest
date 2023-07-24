import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { UserInfo } from './UserInfo';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
export declare class UsersController {
    private usersService;
    private authService;
    constructor(usersService: UsersService, authService: AuthService);
    FindALL(): Promise<User[]>;
    createUser(dto: CreateUserDto): Promise<void>;
    verifyEmail(dto: VerifyEmailDto): Promise<string>;
    login(dto: UserLoginDto): Promise<string>;
    getUserInfo(headers: any, userId: number): Promise<UserInfo>;
}
