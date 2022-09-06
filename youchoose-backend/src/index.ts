import express, { Router, RequestHandler} from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors'
import API_ENDPOINTS from './utils/api_endpoints';
import RegisterUserHandler from './handlers/registerUserHandler';
import FirebaseService from './services/firebaseService';
import FetchClubsHandler from './handlers/fetchClubsHandler';


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

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on port ${process.env.SERVER_PORT}`)
})