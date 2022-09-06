"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfClub = void 0;
function instanceOfClub(data) {
    if (!data)
        return false;
    return 'clubId' in data && 'clubName' in data;
}
exports.instanceOfClub = instanceOfClub;
//# sourceMappingURL=clubs.js.map