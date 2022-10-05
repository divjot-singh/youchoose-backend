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
exports.RemoveSongsCron = void 0;
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const RemoveSongsCron = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        console.log(`running RemoveSongsCron job on ${date} - ${month} - ${year} at ${hours}:${minutes}`);
        let response = yield firebaseService_1.default.deleteAllClubSongs();
        if (response) {
            console.log('RemoveSongsCron failed ');
            console.error(response);
        }
        else {
            console.log(`songs successfully deleted`);
        }
    }
    catch (err) {
        console.log('RemoveSongsCron failed');
        console.error(err);
    }
});
exports.RemoveSongsCron = RemoveSongsCron;
//# sourceMappingURL=removeSongCron.js.map