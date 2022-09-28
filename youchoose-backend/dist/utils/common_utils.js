"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueSongs = void 0;
const getUniqueSongs = (songs) => {
    const songSet = new Set(songs.map((song) => song.videoId));
    const songIds = Array.from(songSet);
    const uniqueSongs = [];
    songIds.forEach((songId) => {
        uniqueSongs.push(songs.find((song) => song.videoId === songId));
    });
    return uniqueSongs;
};
exports.getUniqueSongs = getUniqueSongs;
//# sourceMappingURL=common_utils.js.map