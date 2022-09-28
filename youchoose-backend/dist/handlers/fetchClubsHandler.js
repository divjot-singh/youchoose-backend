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
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const createError_1 = require("../utils/createError");
const FetchClubsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubs = yield firebaseService_1.default.fetchClubs();
        res.status(200).send({ success: true, data: clubs });
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.default = FetchClubsHandler;
//# sourceMappingURL=fetchClubsHandler.js.map