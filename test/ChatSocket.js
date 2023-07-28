"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocket = void 0;
var ws_1 = require("ws");
var ChatSocket = /** @class */ (function (_super) {
    __extends(ChatSocket, _super);
    function ChatSocket(userId, address, protocols, options) {
        var _this = _super.call(this, address, protocols, options) || this;
        _this.userId = userId;
        return _this;
    }
    ChatSocket.prototype.getUserid = function () {
        return this.userId;
    };
    return ChatSocket;
}(ws_1.WebSocket));
exports.ChatSocket = ChatSocket;
