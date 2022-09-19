import express, { Router, RequestHandler} from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors'
import API_ENDPOINTS from './utils/api_endpoints';
import RegisterUserHandler from './handlers/registerUserHandler';
import FirebaseService from './services/firebaseService';
import FetchClubsHandler from './handlers/fetchClubsHandler';
import {AddSongToList, AddSuggestedSongsHandler, FetchClubSongs, FetchSuggestedSongsList, FetchUserSuggestedSongs, RemoveSongFromList, RemoveSongFromSuggestedList, RemoveUserSuggestedSong} from './handlers/suggestedSongsHandler';
import { FetchLikedSongs, LikeUnlikeSong } from './handlers/likeSongHandler';


const router = Router();
const app = express()
const fbService = new FirebaseService()
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
dotenv.config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router)


router.post(API_ENDPOINTS.register, RegisterUserHandler)
router.get(API_ENDPOINTS.fetchClubs, FetchClubsHandler)
router.post(API_ENDPOINTS.addSuggestedSong, AddSuggestedSongsHandler)
router.get(API_ENDPOINTS.userSuggestedSong, FetchUserSuggestedSongs)
router.get(API_ENDPOINTS.suggestedSongsList, FetchSuggestedSongsList)
router.get(API_ENDPOINTS.clubSongs, FetchClubSongs)
router.post(API_ENDPOINTS.removeSuggestedSong,RemoveUserSuggestedSong)
router.post(API_ENDPOINTS.removeSongsFromSuggestion,RemoveSongFromSuggestedList)
router.post(API_ENDPOINTS.addSongToList,AddSongToList)
router.post(API_ENDPOINTS.removeSongFromList,RemoveSongFromList)
router.post(API_ENDPOINTS.likeUnlikeSong,LikeUnlikeSong)
router.get(API_ENDPOINTS.fetchLikedSongs, FetchLikedSongs)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on port ${process.env.SERVER_PORT}`)
})