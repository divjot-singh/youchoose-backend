import { createContext, useContext, useEffect, useState } from "react"
import { SnackbarTypes } from "../components/snackbar"
import Club from "../entities/club"
import Song, { instanceOfSong } from "../entities/song"
import NetworkService from "../services/networkService"
import { API_ENDPOINTS } from "../utils/apiEndpoints"
import { useCommonComponents } from "./commonComponentsProvider"
import { useAuth } from "./userProvider"


export interface ClubContextType{
    setClub:(club:Club) => void,
    club:Club | undefined,
    clubSongsList:Song[],
    removeClubSongs: (song:string) => void,
    updateClubSongs:(song:Song | Song[]) => void
    initialiseClubSongs:() => void
}

export const ClubContext = createContext<ClubContextType>({
    setClub:(club:Club) => {},
    club:undefined,
    clubSongsList:[],
    removeClubSongs: (song:string) => {},
    updateClubSongs:(song:Song | Song[]) => {},
    initialiseClubSongs:() => {}
})

export const ClubProvider = ({ children}:{children:JSX.Element | null}) => {

    const [club, setClub] = useState<Club | undefined>()
    const [addedSongs, setAddedSongs] = useState<Song[]>([])
    const {showLoader, showSnackbar, hideLoader} = useCommonComponents()
    const {user} = useAuth()
    const updateAddedSongs = (song:Song | Song[]) => {
        let sortedSongs:Song[] = []
        
        if(Array.isArray(song)){
            sortedSongs = [...song].sort((song1:Song, song2:Song) => song2.likes - song1.likes)
        } else {
            let currentSongs = addedSongs.filter(addedsong=>song.videoId !== addedsong.videoId)
            sortedSongs = [...currentSongs,song].sort((song1:Song, song2:Song) => song2.likes - song1.likes)
        }
        setAddedSongs(sortedSongs)
    }

    const removeAddedSong = (videoId:string) => {
        setAddedSongs(addedSongs.filter(song => song.videoId !== videoId))
    }
    const fetchClubSongs = async () => {
        const data = await NetworkService.get({
            url: API_ENDPOINTS.clubSongs,
            data:{
                clubId:club?.clubId,
            }
        })
        if(Array.isArray(data)){
            if(instanceOfSong(data[0])){
                let sortedSongs = data.sort((song1:Song, song2:Song) => song2.likes - song1.likes)
                 setAddedSongs(sortedSongs)
            }
        } else {
            showSnackbar({
                children:<span>Cound not fetch club songs</span>,
                type:SnackbarTypes.ERROR
            })
            return Promise.reject('Cound not fetch club songs')
        }
    }
    const initialiseClubSongs = async () => {
        if(!club) return
        showLoader(null)
        try{
            await fetchClubSongs()
            hideLoader()
        } catch (err){
            hideLoader()
            console.error(err)
            showSnackbar({
                children:<span>{typeof err === 'string' ? err : 'Something went wrong'}</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    useEffect(() => {

    },[user])
    return (
        <ClubContext.Provider value={{
            club,
            setClub,
            clubSongsList:addedSongs,
            removeClubSongs:removeAddedSong,
            updateClubSongs:updateAddedSongs,
            initialiseClubSongs
        }}>
            {children}
        </ClubContext.Provider>
    )   
}

export const useClub = () => useContext(ClubContext)
