import {  Request, Response, NextFunction} from 'express';
import User, { instanceOfUser } from '../entities/user';
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
            const response:void | Error = await FirebaseService.addUserToTable(tableUser)
            if(!response){
                res.status(200).send({success:true, data:tableUser})
            } else{
                res.status(200).send(CreateError(response))
            }
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export default RegisterUserHandler