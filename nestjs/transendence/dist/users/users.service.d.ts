import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from '@prisma/client';
export declare class UsersService {
    private emailService;
    private userRepository;
    private authService;
    constructor(emailService: EmailService, userRepository: PrismaService, authService: AuthService);
    createUser(name: string, email: string, password: string): Promise<void>;
    private checkUserExists;
    private saveUser;
    private sendMemberJoinEmail;
    verifyEmail(signupVerifyToken: string): Promise<string>;
    login(email: string, password: string): Promise<string>;
    getUserInfo(UserId: number): Promise<UserInfo>;
    FindAll(): Promise<User[]>;
}
