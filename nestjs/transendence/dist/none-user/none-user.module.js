"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoneUserModule = void 0;
const common_1 = require("@nestjs/common");
const none_user_service_1 = require("./none-user.service");
const none_user_controller_1 = require("./none-user.controller");
let NoneUserModule = exports.NoneUserModule = class NoneUserModule {
};
exports.NoneUserModule = NoneUserModule = __decorate([
    (0, common_1.Module)({
        providers: [none_user_service_1.NoneUserService,
        ],
        controllers: [none_user_controller_1.NoneUserController]
    })
], NoneUserModule);
//# sourceMappingURL=none-user.module.js.map