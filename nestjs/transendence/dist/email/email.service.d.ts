import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';
export declare class EmailService {
    private config;
    private transporter;
    constructor(config: ConfigType<typeof emailConfig>);
    sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string): Promise<any>;
}
