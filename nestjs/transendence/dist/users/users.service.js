"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const uuid = require("uuid");
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma.service");
const auth_service_1 = require("../auth/auth.service");
let UsersService = exports.UsersService = class UsersService {
    constructor(emailService, userRepository, authService) {
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async createUser(name, email, password) {
        const userExist = await this.checkUserExists(email);
        if (userExist) {
            throw new common_1.UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }
        const signupVerifyToken = uuid.v1();
        await this.saveUser(name, email, password, signupVerifyToken);
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }
    async checkUserExists(email) {
        const user = await this.userRepository.user.findUnique({
            where: {
                email: String(email),
            },
        });
        return user !== null;
    }
    async saveUser(name, email, password, signupVerifyToken) {
        const user = await this.userRepository.user.create({
            data: {
                name: name,
                email: email,
                password: password,
                signupVerifyToken: signupVerifyToken,
            }
        });
    }
    async sendMemberJoinEmail(email, signupVerifyToken) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }
    async verifyEmail(signupVerifyToken) {
        const user = await this.userRepository.user.findUnique({
            where: {
                signupVerifyToken: signupVerifyToken
            }
        });
        console.log(await this.userRepository.user.findMany());
        if (!user)
            throw new common_1.NotFoundException('유저가 존재하지 않습니다.');
        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }
    async login(email, password) {
        const user = await this.userRepository.user.findUnique({
            where: {
                email: email,
                password: password
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('유저가 존재하지 않습니다.');
        }
        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email
        });
    }
    async getUserInfo(UserId) {
        const user = await this.userRepository.user.findUnique({
            where: {
                id: UserId,
            }
        });
        if (!user)
            throw new common_1.NotFoundException('유저가 존재하지 않습니다.');
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }
    async FindAll() {
        const user = await this.userRepository.user.findMany();
        return user;
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService, prisma_service_1.PrismaService, auth_service_1.AuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map