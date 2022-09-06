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
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const createError_1 = require("../utils/createError");
const tableEntities_1 = require("../utils/tableEntities");
const service_account_json_1 = __importDefault(require("./service-account.json"));
class FirebaseService {
    constructor() {
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(JSON.parse(JSON.stringify(service_account_json_1.default)))
        });
        FirebaseService.db = (0, firestore_1.getFirestore)();
        FirebaseService.auth = (0, auth_1.getAuth)();
    }
    static addUserToTable(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield FirebaseService.db.collection(tableEntities_1.Tables.user).doc(user.uid).set(user);
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static createCustomToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield FirebaseService.auth.createCustomToken(user.uid);
                return token;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static fetchClubs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield FirebaseService.db.collection(tableEntities_1.Tables.clubs).get();
                console.log(snapshot);
                if (snapshot.empty) {
                    return [];
                }
                else {
                    return snapshot.docs.map((entry) => {
                        const data = entry.data();
                        return {
                            clubId: entry.id,
                            clubName: data.name
                        };
                    });
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
}
exports.default = FirebaseService;
//# sourceMappingURL=firebaseService.js.map