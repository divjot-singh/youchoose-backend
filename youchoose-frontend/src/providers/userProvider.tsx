import { createContext, useContext, useEffect, useState } from "react";
import { SnackbarTypes } from "../components/snackbar";
import {Error as AppError, instanceOfError} from "../entities/error";
import User, { instanceOfUser } from "../entities/user";
import Authenticate, { AuthType } from "../services/authService";
import { GetCurrentUser, Logout, SaveUserToLocalStorage } from "../services/firebaseService";
import LocalStorageMethods from "../services/localstorageService";
import NetworkService from "../services/networkService";
import { API_ENDPOINTS } from "../utils/apiEndpoints";
import { LocalStorageKeys } from "../utils/localstorageKeys";
import { CommonComponentsContextValue, useCommonComponents } from "./commonComponentsProvider";

interface UserContextWrapperProps{
    children: JSX.Element | null,
    isAppInitialised: boolean
}
export interface UserContextValue{
    user: User | null;
    authenticate: (authType: AuthType, email?:string, password?:string, username?:string) => Promise<void>
    signOut: () => Promise<void>
}
const UserContext = createContext<UserContextValue>({
    user:null,
    authenticate:async (authType) => {},
    signOut:async () => {}
})
export const UserContextWrapper = ({children,isAppInitialised}: UserContextWrapperProps) => {
    const [user, setUser] = useState<User | null>(null)
    const commonComponents:CommonComponentsContextValue = useCommonComponents()
    const setInitialUser = async () => {
        commonComponents.showLoader(null)
        const currentUser:User | null | AppError= await GetCurrentUser()
        if(instanceOfUser(currentUser)){
            const appUser: User | null | AppError = await NetworkService.post({url:API_ENDPOINTS.register, data:currentUser})
            if(instanceOfUser(appUser)){
                SaveUserToLocalStorage(appUser)
                setUser(appUser)
            }
        }
        else if(instanceOfError(currentUser)){
            commonComponents.showSnackbar({children:<span>{currentUser.message}</span>,type:SnackbarTypes.ERROR})
        }
        commonComponents.hideLoader()
    }
    useEffect(() => {
        if(isAppInitialised){
            setInitialUser()
        }
    },[isAppInitialised])
    const authenticate = async (authType:AuthType, email?:string, password?:string, username?:string) => {
        commonComponents.showLoader(null)
        const result:User | null | AppError = await Authenticate(authType, email, password, username);
        if(authType === AuthType.None && instanceOfUser(result)){
            LocalStorageMethods.set(LocalStorageKeys.user_id, result.uid)
            setUser(result)
        } else if(instanceOfUser(result) && result.email){
            const appUser: User | null | AppError = await NetworkService.post({url:API_ENDPOINTS.register, data:result})
            if(instanceOfUser(appUser)){
                SaveUserToLocalStorage(appUser)
                setUser(appUser)
            }
        } else if(instanceOfError(result)){
            commonComponents.showSnackbar({children:<span>{result.message}</span>,type:SnackbarTypes.ERROR})
        }
        commonComponents.hideLoader()
    }
    const signOut = async () => {
        commonComponents.showLoader(null)
        await Logout()
        commonComponents.hideLoader()
        setUser(null)
    }
    return (
        <UserContext.Provider value={{
            user,
            authenticate,
            signOut
        }}>
            {children}
        </UserContext.Provider>
    )    
}



export const useAuth = () => useContext(UserContext)