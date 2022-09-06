import {Error} from "../entities/error"
import User from "../entities/user"
import { LoginWithEmail, Register, SignUpWithGoogle } from "./firebaseService"

export enum AuthType {
    Register = 'register',
    Email = 'email',
    Google = 'google'
}

const Authenticate = async (authType: AuthType,email?:string, password?:string, username?:string): Promise<User | null | Error> => {
    switch(authType){
        case AuthType.Google:
            return await SignUpWithGoogle()
        case AuthType.Register:
            return await Register(email, password, username)
        case AuthType.Email:
            return await LoginWithEmail(email, password)
        default:
            return await SignUpWithGoogle()
    }
}

export default Authenticate