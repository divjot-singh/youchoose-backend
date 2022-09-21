import {  Request, Response, NextFunction} from 'express';
import { AddModeratorHandlerBody } from '../entities/postBodyEntities';
import User, { AuthorisedUser, instanceOfAuthorisedUser, instanceOfUser } from '../entities/user';
import FirebaseService from '../services/firebaseService';
import { CreateError } from '../utils/createError';


const RegisterUserHandler = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const user:User | null | undefined=req.body;
        if(instanceOfUser(user)){
            const tableUser:User = {...user}
            const token = await FirebaseService.createCustomToken(user);
            if(typeof token === 'string'){
                tableUser.token = token
            }
            const existingUser:User | Error | null = await FirebaseService.checkIfUserExists(tableUser)
            if(instanceOfUser(existingUser)){
                res.status(200).send({success:true, data:existingUser})
            } else{
                const authorisedUser:AuthorisedUser | Error | null = await FirebaseService.checkIfUserIsAuthorised(tableUser)
                if(instanceOfAuthorisedUser(authorisedUser)){
                    tableUser.user_type = authorisedUser.user_type
                    if(authorisedUser?.club){
                        tableUser.club = authorisedUser.club
                    }
                }
                const response:void | Error = await FirebaseService.addUserToTable(tableUser)
                if(!response){
                    res.status(200).send({success:true, data:tableUser})
                } else{
                    res.status(200).send(CreateError(response))
                }
            }
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const AddModerator = async (req:Request<any, any, AddModeratorHandlerBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:AddModeratorHandlerBody = req.body
        const returnVal:void| Error = await FirebaseService.addModerator(data.email)
        if(!returnVal){
            res.status(200).send({success:true})
        } else{
            res.status(200).send({success:false, error:returnVal})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const GetModerators = async (req:Request<any, any, any, any>, res:Response, next:NextFunction) => {
    try{
        const moderators:string[] | Error = await FirebaseService.getModerators()
        if(Array.isArray(moderators)){
            res.status(200).send({success:true, data:moderators})
        } else{
            res.status(200).send({success:false, error:moderators})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const DeleteModerator = async (req:Request<any, any, AddModeratorHandlerBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:AddModeratorHandlerBody = req.body
        const returnVal:void| Error = await FirebaseService.deleteModerator(data.email)
        if(!returnVal){
            res.status(200).send({success:true})
        } else{
            res.status(200).send({success:false, error:returnVal})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export default RegisterUserHandler