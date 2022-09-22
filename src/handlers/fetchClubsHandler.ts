import {  Request, Response, NextFunction} from 'express';
import { instanceOfClub } from '../entities/clubs';
import { AddClubHandlerBody, ClubHandlerBody, UpdateClubHandlerBody } from '../entities/postBodyEntities';
import User, { instanceOfUser } from '../entities/user';
import FirebaseService from '../services/firebaseService';
import { CreateError } from '../utils/createError';


export const FetchClubsHandler = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const clubs = await FirebaseService.fetchClubs()
        res.status(200).send({success:true, data:clubs})
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const DeleteClubHandler = async (req:Request<any, any, ClubHandlerBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:ClubHandlerBody = req.body
        const returnVal = await FirebaseService.deleteClub(data.clubId, data.email)
        if(!returnVal){
            res.status(200).send({success:true})
        } else{
            res.status(200).send({success:false, error:returnVal})
        }

    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const UpdateClubHandler = async (req:Request<any, any, UpdateClubHandlerBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:UpdateClubHandlerBody = req.body
        const returnVal = await FirebaseService.updateClub(data.club, data.oldEmail)
        if(!returnVal){
            res.status(200).send({success:true, data:data.club})
        } else{
            res.status(200).send({success:false, error:returnVal})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const AddNewClub = async (req:Request<any, any, AddClubHandlerBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:AddClubHandlerBody = req.body
        const returnVal = await FirebaseService.addClub(data.clubName, data.email)
        if(instanceOfClub(returnVal)){
            res.status(200).send({success:true, data:returnVal})
        } else{
            res.status(200).send({success:false, error:returnVal})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}