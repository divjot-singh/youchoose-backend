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
exports.FetchLikedSongs = exports.LikeSong = exports.UnlikeSong = exports.LikeUnlikeSong = void 0;
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const createError_1 = require("../utils/createError");
const LikeUnlikeSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside LikeUnlikeSong');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.likeUnlikeSong(data.userId, data.song);
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
exports.LikeUnlikeSong = LikeUnlikeSong;
const UnlikeSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside LikeUnlikeSong');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.unLikeSong(data.userId, data.song);
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
exports.UnlikeSong = UnlikeSong;
const LikeSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside LikeUnlikeSong');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.likeSong(data.userId, data.song);
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
exports.LikeSong = LikeSong;
const FetchLikedSongs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside FetchLikedSongs');
        const data = req.query;
        const returnVal = yield firebaseService_1.default.fetchLikedSongs(data.userId);
        if (Array.isArray(returnVal)) {
            res.status(200).send({ success: true, data: returnVal });
        }
        else {
            res.status(200).send({ success: false, error: returnVal });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.FetchLikedSongs = FetchLikedSongs;
//# sourceMappingURL=likeSongHandler.js.map