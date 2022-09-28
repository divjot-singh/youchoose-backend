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
exports.AddNewClub = exports.UpdateClubHandler = exports.DeleteClubHandler = exports.FetchClubsHandler = void 0;
const clubs_1 = require("../entities/clubs");
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const createError_1 = require("../utils/createError");
const FetchClubsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside FetchClubsHandler');
        const clubs = yield firebaseService_1.default.fetchClubs();
        res.status(200).send({ success: true, data: clubs });
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.FetchClubsHandler = FetchClubsHandler;
const DeleteClubHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside DeleteClubHandler');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.deleteClub(data.clubId, data.email);
        if (!returnVal) {
            res.status(200).send({ success: true });
        }
        else {
            res.status(200).send({ success: false, error: returnVal });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.DeleteClubHandler = DeleteClubHandler;
const UpdateClubHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside UpdateClubHandler');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.updateClub(data.club, data.oldEmail);
        if (!returnVal) {
            res.status(200).send({ success: true, data: data.club });
        }
        else {
            res.status(200).send({ success: false, error: returnVal });
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.UpdateClubHandler = UpdateClubHandler;
const AddNewClub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside AddNewClub');
        const data = req.body;
        const returnVal = yield firebaseService_1.default.addClub(data.clubName, data.email);
        if ((0, clubs_1.instanceOfClub)(returnVal)) {
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
exports.AddNewClub = AddNewClub;
//# sourceMappingURL=fetchClubsHandler.js.map