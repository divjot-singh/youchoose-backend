"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClubFromMap = exports.instanceOfClub = void 0;
function instanceOfClub(data) {
    if (!data)
        return false;
    return 'clubId' in data && 'clubName' in data;
}
exports.instanceOfClub = instanceOfClub;
function getClubFromMap(data) {
    if (!data)
        return;
    const { clubId = '', clubName = '' } = data || {};
    const club = {
        clubId,
        clubName
    };
    return club;
}
exports.getClubFromMap = getClubFromMap;
//# sourceMappingURL=clubs.js.map