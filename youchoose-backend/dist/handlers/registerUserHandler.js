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
const user_1 = require("../entities/user");
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const createError_1 = require("../utils/createError");
const RegisterUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        if ((0, user_1.instanceOfUser)(user)) {
            const tableUser = Object.assign({}, user);
            const token = yield firebaseService_1.default.createCustomToken(user);
            if (typeof token === 'string') {
                tableUser.token = token;
            }
            const existingUser = yield firebaseService_1.default.checkIfUserExists(tableUser);
            if ((0, user_1.instanceOfUser)(existingUser)) {
                res.status(200).send({ success: true, data: existingUser });
            }
            else {
                const authorisedUser = yield firebaseService_1.default.checkIfUserIsAuthorised(tableUser);
                if ((0, user_1.instanceOfAuthorisedUser)(authorisedUser)) {
                    tableUser.user_type = authorisedUser.user_type;
                    if (authorisedUser === null || authorisedUser === void 0 ? void 0 : authorisedUser.club) {
                        tableUser.club = authorisedUser.club;
                    }
                }
                const response = yield firebaseService_1.default.addUserToTable(tableUser);
                if (!response) {
                    res.status(200).send({ success: true, data: tableUser });
                }
                else {
                    res.status(200).send((0, createError_1.CreateError)(response));
                }
            }
        }
    }
    catch (err) {
        res.status(200).send((0, createError_1.CreateError)(err));
    }
});
exports.default = RegisterUserHandler;
//# sourceMappingURL=registerUserHandler.js.map