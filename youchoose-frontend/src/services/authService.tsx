import {Error} from "../entities/error"
import User, { UserType } from "../entities/user"
import { LoginWithEmail, Register, SignUpWithGoogle } from "./firebaseService"
import {v4} from 'uuid'

export enum AuthType {
    Register = 'register',
    Email = 'email',
    Google = 'google',
    None = 'none'
}

async function LoginWithUUID():Promise<User | null | Error>{
    let uid = v4()
    const user:User = {
        uid,
        user_type:UserType.USER,
        display_name:'',
        photo_url:'',
        token:'',
        email:''
    }
    return user 
}   

const Authenticate = async (authType: AuthType,email?:string, password?:string, username?:string): Promise<User | null | Error> => {
    switch(authType){
        case AuthType.Google:
            return await SignUpWithGoogle()
        case AuthType.Register:
            return await Register(email, password, username)
        case AuthType.Email:
            return await LoginWithEmail(email, password)
        case AuthType.None:
            return await LoginWithUUID()
        default:
            return await SignUpWithGoogle()
    }
}

export default Authenticate