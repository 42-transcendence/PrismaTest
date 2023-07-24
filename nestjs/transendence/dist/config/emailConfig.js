"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('email', () => ({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
    },
    baseUrl: process.env.EMAIL_BASE_URL
}));
//# sourceMappingURL=emailConfig.js.map