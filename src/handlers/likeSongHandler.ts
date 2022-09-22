import { NextFunction, Request, Response } from "express"
import Song from "../entities/song"
import {  FetchLikedSongsBody, LikeSongBody } from "../entities/postBodyEntities"
import FirebaseService from "../services/firebaseService"
import { CreateError, instanceOfError } from "../utils/createError"

export const LikeUnlikeSong = async (req:Request<any, any,LikeSongBody, any>, res:Response, next:NextFunction) => {
    try{
        const data:LikeSongBody = req.body
        const returnVal:void | Error = await FirebaseService.likeUnlikeSong(data.userId, data.song)
        if(instanceOfError(returnVal)){
            res.status(200).send({success:false, error:returnVal})
        } else{
            res.status(200).send({success:true})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}

export const FetchLikedSongs = async (req:Request<any, any,any, FetchLikedSongsBody>, res:Response, next:NextFunction) => {
    try{
        const data:FetchLikedSongsBody = req.query
        const returnVal:Song[] | Error = await FirebaseService.fetchLikedSongs(data.userId)
        if(Array.isArray(returnVal)){
            res.status(200).send({success:true, data:returnVal})
        } else{
            res.status(200).send({success:false, error:returnVal})
        }
    } catch(err){
        res.status(200).send(CreateError(err))
    }
}