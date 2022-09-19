import {  Request, Response, NextFunction} from 'express';
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

export default RegisterUserHandler