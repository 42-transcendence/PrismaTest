import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/authConfig';
interface User {
    id: number;
    name: string;
    email: string;
}
export declare class AuthService {
    private config;
    constructor(config: ConfigType<typeof authConfig>);
    login(user: User): string;
    verify(jwtString: string): {
        userId: number;
        email: string;
    };
}
export {};
