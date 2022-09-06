import {  Request, Response, NextFunction} from 'express';
import User, { instanceOfUser } from '../entities/user';
import FirebaseService from '../services/firebaseService';
import { CreateError } from '../utils/createError';


const FetchClubsHandler = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const clubs = await FirebaseService.fetchClubs()
        res.status(200).send({success:true, data:clubs})
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export default FetchClubsHandler