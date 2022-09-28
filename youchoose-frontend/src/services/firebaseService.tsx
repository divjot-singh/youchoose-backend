import React from 'react'
import { Auth, getAuth, getRedirectResult, GoogleAuthProvider, OAuthCredential, signInWithPopup, signInWithCredential, UserCredential, User as FirebaseUser, signOut, EmailAuthProvider, createUserWithEmailAndPassword, EmailAuthCredential, signInWithEmailAndPassword, getIdTokenResult, IdTokenResult, signInWithCustomToken } from "firebase/auth";
import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import User, { UserType } from '../entities/user';
import { LocalStorageKeys } from '../utils/localstorageKeys';
import LocalStorageMethods from './localstorageService';
import { useCommonComponents } from '../providers/commonComponentsProvider';
import { ErrorCodeStrings } from '../utils/errorCodeStrings';
import {Error} from '../entities/error';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_API_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log(firebaseConfig)

export const InitialiseFirebaseApp = () => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    return true
}

const getUser = (firebaseUser:FirebaseUser, userType:UserType, token:string):User => {
    const user:User = {
        display_name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photo_url: firebaseUser.photoURL || '',
        uid: firebaseUser.uid,
        user_type: userType,
        token: token
    } 

    return user;
}

export const SaveUserToLocalStorage = (user:User) => {
    LocalStorageMethods.set(LocalStorageKeys.user_id, user.uid)
    LocalStorageMethods.set(LocalStorageKeys.token, user.token)
    LocalStorageMethods.set(LocalStorageKeys.type, user.user_type)
}

export const RemoveUserFromLocalStorage = () => {
    LocalStorageMethods.delete(LocalStorageKeys.user_id)
    LocalStorageMethods.delete(LocalStorageKeys.token)
    LocalStorageMethods.delete(LocalStorageKeys.type)
}

export const getError = (err:FirebaseError | any) => {
    const error:Error = {
        code: err.code,
        message: err.message
    }
    console.error(err)
    return error
}

export const GetCurrentUser = async (): Promise<User | null | Error> => {
    try{
        const auth : Auth = getAuth();
        const token:string = LocalStorageMethods.get(LocalStorageKeys.token) ?? ''
        if(token){
            const result: UserCredential | null = await signInWithCustomToken(auth, token)
            if(result){
                const user = getUser(result.user, UserType.USER, token || '');
                return user;
            }
            return null;
        }
        return null
    } catch(err) {
        return getError(err);
    } 
}

export const SignUpWithGoogle = async (): Promise<User | null | Error> => {
        const auth : Auth = getAuth();
        const provider:GoogleAuthProvider = new GoogleAuthProvider();
        try{
            const result: UserCredential | null = await signInWithPopup(auth, provider)
            if(result){
                const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = getUser(result.user, UserType.USER, token || '');
                SaveUserToLocalStorage(user);
                return user;
            }
            return null;
        } catch(err){
            return getError(err);
        }
}

export const Register = async (email?:string, password?:string, username?:string):Promise<User | null | Error> =>{
    if(!email || !password) return null
    const auth : Auth = getAuth();
    
    try{
        const result: UserCredential | null = await createUserWithEmailAndPassword(auth, email, password)
        if(result){
            const idToken = getIdTokenResult(result.user)
            console.log(idToken)
            const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = getUser(result.user, UserType.USER, token || '');
            return user;
        }
        return null
    } catch(err:FirebaseError | any){
        return getError(err);
    }
}

export const LoginWithEmail = async (email?:string, password?:string): Promise<User | null | Error> => {
    if(!email || !password) return null
    const auth : Auth = getAuth();
    
    try{
        const result: UserCredential | null = await signInWithEmailAndPassword(auth, email, password)
        if(result){
            const idToken:IdTokenResult = await getIdTokenResult(result.user)
            const user = getUser(result.user, UserType.USER, idToken.token || '');
            return user;
        }
        return null
    } catch(err:FirebaseError | any){
        return getError(err);
    }
}

export const Logout = async () => {
    const auth : Auth = getAuth();
    await signOut(auth)
    RemoveUserFromLocalStorage()
}