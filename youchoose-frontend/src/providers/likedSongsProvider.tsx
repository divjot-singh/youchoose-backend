import { createContext, useContext, useState } from "react";
import { SnackbarTypes } from "../components/snackbar";
import Song, { instanceOfSong } from "../entities/song";
import NetworkService from "../services/networkService";
import { API_ENDPOINTS } from "../utils/apiEndpoints";
import { useCommonComponents } from "./commonComponentsProvider";
import { useAuth } from "./userProvider";



export interface LikedSongsContextType{
    likedSongs:Song[],
    addLikedSong:(song:Song) => void,
    removeLikedSong:(song:Song) => void,
    initialiseLikedSongs:() => void
}


export const LikedSongsContext = createContext<LikedSongsContextType>({
    likedSongs:[],
    addLikedSong:(song:Song) => {},
    removeLikedSong:(song:Song) => {},
    initialiseLikedSongs:() => {}
})

export const LikedSongsProvider = ({ children}:{children:JSX.Element | null}) => {
    const [likedSongs, setLikedSongs] = useState<Song[]>([])
    const [isInitialised, setIsInitialised] = useState<boolean>(false)
    const {showSnackbar, hideLoader, showLoader} = useCommonComponents()
    const {user} = useAuth()
    const initialiseLikedSongs = async () => {
        if(!user || !user.uid) return
        if(isInitialised) return
        try{
            showLoader(null)
            setIsInitialised(true)
            let songs = await NetworkService.get({
                url:API_ENDPOINTS.fetchLikedSongs,
                data:{
                    userId:user?.uid
                }
            })
            hideLoader()
            if(Array.isArray(songs)){
                if(instanceOfSong(songs[0])) setLikedSongs(songs)
            } else{
                console.error(songs)
                showSnackbar({
                    children:<span>Could not fetch liked songs.</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            hideLoader()
            console.error(err)
            showSnackbar({
                children:<span>Could not fetch liked songs.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const addLikedSong = (song:Song) => {
        let updatedSongs = likedSongs.filter((likedSong:Song) => likedSong.videoId !== song.videoId )
        updatedSongs.push(song)
        setLikedSongs(updatedSongs)
    }
    const removeLikedSong = (song:Song) => {
        setLikedSongs(likedSongs.filter((likedSong:Song) => likedSong.videoId !== song.videoId ))
    }
    return (
        <LikedSongsContext.Provider value={{
            likedSongs,
            addLikedSong,
            removeLikedSong,
            initialiseLikedSongs
        }}>
            {children}
        </LikedSongsContext.Provider>
    )  
}

export const useLikedSongs = () => useContext(LikedSongsContext)