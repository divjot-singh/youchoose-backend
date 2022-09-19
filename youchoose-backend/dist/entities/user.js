"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfAuthorisedUser = exports.instanceOfUser = exports.getUserFromSnapshot = exports.UserType = void 0;
const clubs_1 = require("./clubs");
var UserType;
(function (UserType) {
    UserType["USER"] = "user";
    UserType["MODERATOR"] = "moderator";
    UserType["DJ"] = "dj";
})(UserType = exports.UserType || (exports.UserType = {}));
function getUserFromSnapshot(data) {
    const { display_name = '', email = '', photo_url = '', uid = '', user_type = 'user', token = '', credential = null, club } = data || {};
    const userTypeKey = user_type;
    const user = {
        display_name,
        email,
        uid,
        user_type: userTypeKey,
        token,
        credential,
        photo_url,
    };
    if (club) {
        user.club = (0, clubs_1.getClubFromMap)(club);
    }
    return user;
}
exports.getUserFromSnapshot = getUserFromSnapshot;
function instanceOfUser(data) {
    if (!data)
        return false;
    return 'uid' in data && 'token' in data && 'user_type' in data && 'email' in data;
}
exports.instanceOfUser = instanceOfUser;
function instanceOfAuthorisedUser(data) {
    if (!data)
        return false;
    return 'user_type' in data && 'email' in data;
}
exports.instanceOfAuthorisedUser = instanceOfAuthorisedUser;
//# sourceMappingURL=user.js.map