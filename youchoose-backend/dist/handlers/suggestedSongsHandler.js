"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveUserSuggestedSong = exports.FetchUserSuggestedSongs = exports.RemoveSongFromList = exports.RemoveUserSuggestedSongFromList = exports.AddSongToList = exports.FetchClubSongs = void 0;
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const createError_1 = require("../utils/createError");
const FetchClubSongs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside FetchClubSongs');
        const data = req.query;
        const returnVal = yield firebaseService_1.default.fetchClubSongs(data.clubId);
        if (Array.isArray(returnVal)) {
            res.status(200).send({ success: true, data: returnVal });
        }
        else {
            res.status(200).send({ success: false });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.FetchClubSongs = FetchClubSongs;
const AddSongToList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside AddSongToList');
        const data = req.body;
        const songLikes = yield firebaseService_1.default.addSongToList(data.clubId, data.song, data.userId);
        if ((0, createError_1.instanceOfError)(songLikes)) {
            res.status(200).send({ success: false, error: songLikes });
        }
        else {
            res.status(200).send({ success: true, data: { likes: songLikes } });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.AddSongToList = AddSongToList;
const RemoveUserSuggestedSongFromList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside RemoveUserSuggestedSongFromList');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.removeUserSuggestedSong(data.clubId, data.songId, data.userId);
        if ((0, createError_1.instanceOfError)(returnVal)) {
            res.status(200).send({ success: false, error: returnVal });
        }
        else {
            res.status(200).send({ success: true, data: { likes: returnVal } });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.RemoveUserSuggestedSongFromList = RemoveUserSuggestedSongFromList;
const RemoveSongFromList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside RemoveSongFromList');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.removeSongFromList(data.clubId, data.songId);
        if ((0, createError_1.instanceOfError)(returnVal)) {
            res.status(200).send({ success: false, error: returnVal });
        }
        else {
            res.status(200).send({ success: true });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.RemoveSongFromList = RemoveSongFromList;
const FetchUserSuggestedSongs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside FetchUserSuggestedSongs');
        const data = req.query;
        const returnVal = yield firebaseService_1.default.fetchUserSuggestedClubSongs(data.clubId, data.userId);
        if (Array.isArray(returnVal)) {
            res.status(200).send({ success: true, data: returnVal });
        }
        else {
            res.status(200).send({ success: false });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.FetchUserSuggestedSongs = FetchUserSuggestedSongs;
const RemoveUserSuggestedSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside RemoveUserSuggestedSong');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.removeUserSuggestedSong(data.clubId, data.songId, data.userId);
        if ((0, createError_1.instanceOfError)(returnVal)) {
            res.status(200).send({ success: false, error: returnVal });
        }
        else {
            res.status(200).send({ success: true, data: { likes: returnVal } });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.RemoveUserSuggestedSong = RemoveUserSuggestedSong;
//# sourceMappingURL=suggestedSongsHandler.js.map