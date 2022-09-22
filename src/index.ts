import express, { Router, RequestHandler} from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors'
import API_ENDPOINTS from './utils/api_endpoints';
import RegisterUserHandler, { AddModerator, DeleteModerator, GetModerators } from './handlers/registerUserHandler';
import FirebaseService from './services/firebaseService';
import {AddNewClub, DeleteClubHandler, FetchClubsHandler, UpdateClubHandler} from './handlers/fetchClubsHandler';
import {AddSongToList, AddSuggestedSongsHandler, FetchClubSongs, FetchSuggestedSongsList, FetchUserSuggestedSongs, RemoveSongFromList, RemoveSongFromSuggestedList, RemoveUserSuggestedSong} from './handlers/suggestedSongsHandler';
import { FetchLikedSongs, LikeUnlikeSong } from './handlers/likeSongHandler';


const router = Router();
const app = express()
var whitelist = ['http://localhost:3000', 'https://you-choose-9876.web.app']
const corsOptions = {
  origin: function (origin:string, callback:Function) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 820
}
app.use(cors(corsOptions))
dotenv.config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());

app.use('/', router)

const service = new FirebaseService()

app.set('port', (process.env.PORT || 8080))
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
router.get(API_ENDPOINTS.getModerators, GetModerators)
router.post(API_ENDPOINTS.updateClub, UpdateClubHandler)
router.post(API_ENDPOINTS.deleteClub, DeleteClubHandler)
router.post(API_ENDPOINTS.addModerator, AddModerator)
router.post(API_ENDPOINTS.addClub, AddNewClub)
router.post(API_ENDPOINTS.deleteMod, DeleteModerator)

app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`)
})