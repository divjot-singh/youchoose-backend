"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfUser = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["USER"] = "user";
    UserType["MODERATOR"] = "moderator";
    UserType["DJ"] = "dj";
})(UserType = exports.UserType || (exports.UserType = {}));
function instanceOfUser(data) {
    if (!data)
        return false;
    return 'uid' in data && 'token' in data && 'user_type' in data && 'email' in data;
}
exports.instanceOfUser = instanceOfUser;
//# sourceMappingURL=user.js.map