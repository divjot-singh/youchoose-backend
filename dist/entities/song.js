"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongFromMap = void 0;
const getSongFromMap = (data) => {
    const { title = '', etag = '', videoId = '', channelId = '', channelTitle = '', imageUrl = '', likes = 0, artistName = '' } = data || {};
    const song = {
        title,
        channelId,
        channelTitle,
        videoId,
        imageUrl,
        etag,
        likes,
        artistName,
    };
    return song;
};
exports.getSongFromMap = getSongFromMap;
//# sourceMappingURL=song.js.map