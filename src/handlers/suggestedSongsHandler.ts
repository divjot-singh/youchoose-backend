import {  Request, Response, NextFunction} from 'express';
import Song from '../entities/song';
import { AddSongToListBody, AddSuggestedSongsHandlerBody, FetchClubSongsHandlerBody, FetchUserSuggestedClubSongsHandlerBody, RemoveSongFromListBody, RemoveUserSuggestedSongHandlerBody, SuggestedSongsQueryParams } from '../entities/postBodyEntities';
import FirebaseService from '../services/firebaseService';
import { CreateError, instanceOfError } from '../utils/createError';


export const AddSuggestedSongsHandler = async (req:Request<any, any, AddSuggestedSongsHandlerBody,any>, res:Response, next:NextFunction) => {
    try{
        const data:AddSuggestedSongsHandlerBody = req.body
        console.log('data',data)
        const returnVal: string | Error = await FirebaseService.addSuggestedSongToClub(data)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true, data:{docId:returnVal}})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const FetchClubSongs = async(req:Request<any, any, any,FetchClubSongsHandlerBody>, res:Response, next:NextFunction) => {
    try{
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

export const FetchUserSuggestedSongs = async(req:Request<any, any, any,FetchUserSuggestedClubSongsHandlerBody>, res:Response, next:NextFunction) => {
    try{
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
        const data:RemoveUserSuggestedSongHandlerBody = req.body
        const returnVal: void | Error = await FirebaseService.removeUserSuggestedSong(data.clubId, data.docId)
        if(returnVal){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const FetchSuggestedSongsList = async(req:Request<any, any, any, SuggestedSongsQueryParams>, res:Response, next:NextFunction) => {
    try{
        const data:SuggestedSongsQueryParams = req.query
        const songsList: Song[] | Error = await FirebaseService.getSuggestedSongs(data.clubId)
        if(Array.isArray(songsList)){
            res.status(200).send({success:true, data:songsList})
        } else{
            res.status(200).send({success:false})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const AddSongToList = async(req:Request<any, any, AddSongToListBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:AddSongToListBody = req.body
        const songDocId: string | Error = await FirebaseService.addSongToList(data.clubId, data.song)
        if(instanceOfError(songDocId)){
            res.status(200).send({success:false, error:songDocId})
        } else{
            res.status(200).send({success:true, data:{docId:songDocId}})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}
export const RemoveSongFromList = async(req:Request<any, any, AddSongToListBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:AddSongToListBody = req.body
        const returnVal: void | Error = await FirebaseService.removeSongFromList(data.clubId, data.song)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const RemoveSongFromSuggestedList = async(req:Request<any, any,RemoveSongFromListBody, any>, res:Response, next:NextFunction ) => {
    try{
        const data:RemoveSongFromListBody = req.body
        const returnVal: void | Error = await FirebaseService.removeSuggestedSong(data.clubId, data.songId)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}