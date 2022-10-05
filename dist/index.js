"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const api_endpoints_1 = __importDefault(require("./utils/api_endpoints"));
const registerUserHandler_1 = require("./handlers/registerUserHandler");
const firebaseService_1 = __importDefault(require("./services/firebaseService"));
const fetchClubsHandler_1 = require("./handlers/fetchClubsHandler");
const suggestedSongsHandler_1 = require("./handlers/suggestedSongsHandler");
const likeSongHandler_1 = require("./handlers/likeSongHandler");
const cron_1 = require("cron");
const removeSongCron_1 = require("./handlers/removeSongCron");
const router = (0, express_1.Router)();
const app = (0, express_1.default)();
var whitelist = ['http://localhost:3000', 'https://you-choose-9876.web.app'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
dotenv_1.default.config();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/', router);
const service = new firebaseService_1.default();
app.set('port', (process.env.PORT || 8080));
router.post(api_endpoints_1.default.register, registerUserHandler_1.RegisterUserHandler);
router.get(api_endpoints_1.default.fetchClubs, fetchClubsHandler_1.FetchClubsHandler);
router.get(api_endpoints_1.default.userSuggestedSong, suggestedSongsHandler_1.FetchUserSuggestedSongs);
router.get(api_endpoints_1.default.clubSongs, suggestedSongsHandler_1.FetchClubSongs);
router.post(api_endpoints_1.default.removeSuggestedSong, suggestedSongsHandler_1.RemoveUserSuggestedSong);
router.post(api_endpoints_1.default.addSongToList, suggestedSongsHandler_1.AddSongToList);
router.post(api_endpoints_1.default.removeSongFromList, suggestedSongsHandler_1.RemoveSongFromList);
router.post(api_endpoints_1.default.likeUnlikeSong, likeSongHandler_1.LikeUnlikeSong);
router.get(api_endpoints_1.default.fetchLikedSongs, likeSongHandler_1.FetchLikedSongs);
router.get(api_endpoints_1.default.getModerators, registerUserHandler_1.GetModerators);
router.post(api_endpoints_1.default.updateClub, fetchClubsHandler_1.UpdateClubHandler);
router.post(api_endpoints_1.default.deleteClub, fetchClubsHandler_1.DeleteClubHandler);
router.post(api_endpoints_1.default.addModerator, registerUserHandler_1.AddModerator);
router.post(api_endpoints_1.default.addClub, fetchClubsHandler_1.AddNewClub);
router.post(api_endpoints_1.default.deleteMod, registerUserHandler_1.DeleteModerator);
router.post(api_endpoints_1.default.likeSong, likeSongHandler_1.LikeSong);
router.post(api_endpoints_1.default.unlikeSong, likeSongHandler_1.UnlikeSong);
const printCurrentTime = () => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    const timezone = date_ob.getTimezoneOffset();
    console.log(`current date-time on server ${date} - ${month} - ${year}, ${hours}:${minutes} ${timezone}`);
};
const cronJob = new cron_1.CronJob('59 21 * * *', removeSongCron_1.RemoveSongsCron);
if (!cronJob.running) {
    printCurrentTime();
    console.log(`scheduling cron job to run at 21:59 every day server time (7:59am Brisbane time)`);
    cronJob.start();
}
app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});
//# sourceMappingURL=index.js.map