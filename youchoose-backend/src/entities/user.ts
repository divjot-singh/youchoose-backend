import { OAuthCredential } from "firebase/auth";
import Club, { getClubFromMap } from "./clubs";

export enum UserType{
    USER='user',
    MODERATOR='moderator',
    DJ='dj'
}

export default interface User{
    display_name:string;
    email:string;
    photo_url:string;
    uid:string;
    user_type:UserType
    token:string;
    credential:OAuthCredential | null,
    club?:Club
}

export function getUserFromSnapshot(data:FirebaseFirestore.DocumentData):User{
    const {display_name = '', email = '', photo_url= '', uid='', user_type = 'user', token = '', credential = null, club} = data || {}
    const userTypeKey = user_type as keyof typeof UserType;
    const user:User = {
        display_name,
        email,
        uid,
        user_type:userTypeKey as UserType ,
        token,
        credential,
        photo_url,
    }
    if(club){
        user.club = getClubFromMap(club)
    }
    return user
}

export function instanceOfUser(data: any): data is User {
    if(!data) return false
    return 'uid' in data && 'token' in data && 'user_type' in data && 'email' in data;
}

export interface AuthorisedUser{
    email:string;
    user_type:UserType;
    club?:Club;
}

export function instanceOfAuthorisedUser(data: any): data is AuthorisedUser {
    if(!data) return false
    return 'user_type' in data && 'email' in data;
}