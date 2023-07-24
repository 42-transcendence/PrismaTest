"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const joi = require("joi");
exports.validationSchema = joi.object({
    EMAIL_SERVICE: joi.string().required(),
    EMAIL_AUTH_USER: joi.string().required(),
    EMAIL_AUTH_PASSWORD: joi.string().required(),
    EMAIL_BASE_URL: joi.string().required().uri(),
});
//# sourceMappingURL=validationSchema.js.map