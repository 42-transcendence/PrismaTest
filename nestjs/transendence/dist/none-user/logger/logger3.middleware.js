"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger3 = void 0;
function logger3(req, res, next) {
    console.log('Request3...');
    next();
}
exports.logger3 = logger3;
//# sourceMappingURL=logger3.middleware.js.map