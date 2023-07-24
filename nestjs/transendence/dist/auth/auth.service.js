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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
const authConfig_1 = require("../config/authConfig");
let AuthService = exports.AuthService = class AuthService {
    constructor(config) {
        this.config = config;
    }
    login(user) {
        const payload = { ...user };
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: '1d',
            audience: 'example.com',
            issuer: 'example.com',
        });
    }
    verify(jwtString) {
        try {
            const payload = jwt.verify(jwtString, this.config.jwtSecret);
            const { id, email } = payload;
            return {
                userId: Number(id),
                email
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(authConfig_1.default.KEY)),
    __metadata("design:paramtypes", [void 0])
], AuthService);
//# sourceMappingURL=auth.service.js.map