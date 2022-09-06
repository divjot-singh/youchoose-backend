import { OAuthCredential } from "firebase/auth";

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
    credential:OAuthCredential | null
}

export function instanceOfUser(data: any): data is User {
    if(!data) return false
    return 'uid' in data && 'token' in data && 'user_type' in data && 'email' in data;
}