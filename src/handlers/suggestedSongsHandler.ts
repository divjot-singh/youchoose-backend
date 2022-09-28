import {  Request, Response, NextFunction} from 'express';
import Song from '../entities/song';
import { AddSongToListBody, FetchClubSongsHandlerBody, FetchUserSuggestedClubSongsHandlerBody, RemoveSongToListBody, RemoveUserSuggestedSongHandlerBody } from '../entities/postBodyEntities';
import FirebaseService from '../services/firebaseService';
import { CreateError, instanceOfError } from '../utils/createError';

export const FetchClubSongs = async(req:Request<any, any, any,FetchClubSongsHandlerBody>, res:Response, next:NextFunction) => {
    try{
        console.log('inside FetchClubSongs')
        const data:FetchClubSongsHandlerBody = req.query;
        const returnVal: Song[] | Error = await FirebaseService.fetchClubSongs(data.clubId)
        if(Array.isArray(returnVal)){
            res.status(200).send({success:true, data:returnVal})
        } else{
            res.status(200).send({success:false})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}



export const AddSongToList = async(req:Request<any, any, AddSongToListBody, any>, res:Response, next:NextFunction) => {
    try{
        console.log('inside AddSongToList')
        const data:AddSongToListBody = req.body
        const songLikes: number | Error = await FirebaseService.addSongToList(data.clubId, data.song, data.userId)
        if(instanceOfError(songLikes)){
            res.status(200).send({success:false, error:songLikes})
        } else{
            res.status(200).send({success:true, data:{likes:songLikes}})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const RemoveUserSuggestedSongFromList = async(req:Request<any, any, RemoveSongToListBody, any>, res:Response, next:NextFunction) => {
    try{
        console.log('inside RemoveUserSuggestedSongFromList')
        const data:RemoveSongToListBody = req.body
        const returnVal: number | Error = await FirebaseService.removeUserSuggestedSong(data.clubId, data.songId, data.userId)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true, data:{likes:returnVal}})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const RemoveSongFromList = async(req:Request<any, any, RemoveSongToListBody, any>, res:Response, next:NextFunction) => {
    try{
        console.log('inside RemoveSongFromList')
        const data:RemoveSongToListBody = req.body
        const returnVal: void | Error = await FirebaseService.removeSongFromList(data.clubId, data.songId)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}



export const FetchUserSuggestedSongs = async(req:Request<any, any, any,FetchUserSuggestedClubSongsHandlerBody>, res:Response, next:NextFunction) => {
    try{
        console.log('inside FetchUserSuggestedSongs')
        const data:FetchUserSuggestedClubSongsHandlerBody = req.query
        const returnVal: Song[] | Error = await FirebaseService.fetchUserSuggestedClubSongs(data.clubId, data.userId)
        if(Array.isArray(returnVal)){
            res.status(200).send({success:true, data:returnVal})
        } else{
            res.status(200).send({success:false})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const RemoveUserSuggestedSong = async(req:Request<any, any, RemoveUserSuggestedSongHandlerBody, any>, res:Response, next:NextFunction) => {
    try{
        console.log('inside RemoveUserSuggestedSong')
        const data:RemoveUserSuggestedSongHandlerBody = req.body
        const returnVal: number | Error = await FirebaseService.removeUserSuggestedSong(data.clubId, data.songId, data.userId)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true, data:{likes:returnVal}})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}
