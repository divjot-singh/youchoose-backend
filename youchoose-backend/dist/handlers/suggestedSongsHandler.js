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
exports.RemoveSongFromSuggestedList = exports.RemoveSongFromList = exports.AddSongToList = exports.FetchSuggestedSongsList = exports.RemoveUserSuggestedSong = exports.FetchUserSuggestedSongs = exports.FetchClubSongs = exports.AddSuggestedSongsHandler = void 0;
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const createError_1 = require("../utils/createError");
const AddSuggestedSongsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside AddSuggestedSongsHandler');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.addSuggestedSongToClub(data);
        if ((0, createError_1.instanceOfError)(returnVal)) {
            res.status(200).send({ success: false, error: returnVal });
        }
        else {
            res.status(200).send({ success: true, data: { docId: returnVal } });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.AddSuggestedSongsHandler = AddSuggestedSongsHandler;
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
        const returnVal = yield firebaseService_1.default.removeUserSuggestedSong(data.clubId, data.docId);
        if (returnVal) {
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
exports.RemoveUserSuggestedSong = RemoveUserSuggestedSong;
const FetchSuggestedSongsList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside FetchSuggestedSongsList');
        const data = req.query;
        const songsList = yield firebaseService_1.default.getSuggestedSongs(data.clubId);
        if (Array.isArray(songsList)) {
            res.status(200).send({ success: true, data: songsList });
        }
        else {
            res.status(200).send({ success: false });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.FetchSuggestedSongsList = FetchSuggestedSongsList;
const AddSongToList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside AddSongToList');
        const data = req.body;
        const songDocId = yield firebaseService_1.default.addSongToList(data.clubId, data.song);
        if ((0, createError_1.instanceOfError)(songDocId)) {
            res.status(200).send({ success: false, error: songDocId });
        }
        else {
            res.status(200).send({ success: true, data: { docId: songDocId } });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.AddSongToList = AddSongToList;
const RemoveSongFromList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside RemoveSongFromList');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.removeSongFromList(data.clubId, data.song);
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
const RemoveSongFromSuggestedList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside RemoveSongFromSuggestedList');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.removeSuggestedSong(data.clubId, data.songId);
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
exports.RemoveSongFromSuggestedList = RemoveSongFromSuggestedList;
//# sourceMappingURL=suggestedSongsHandler.js.map