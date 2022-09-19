import { createContext, useContext, useState } from "react"
import Club from "../entities/club"
import Song from "../entities/song"


export interface ClubContextType{
    setClub:(club:Club) => void,
    club:Club | undefined,
    addedSongs:Song[],
    removeAddedSong: (song:string) => void,
    updateAddedSongs:(song:Song | Song[]) => void
}

export const ClubContext = createContext<ClubContextType>({
    setClub:(club:Club) => {},
    club:undefined,
    addedSongs:[],
    removeAddedSong: (song:string) => {},
    updateAddedSongs:(song:Song | Song[]) => {}
})

export const ClubProvider = ({ children}:{children:JSX.Element | null}) => {

    const [club, setClub] = useState<Club | undefined>()
    const [addedSongs, setAddedSongs] = useState<Song[]>([])

    const updateAddedSongs = (song:Song | Song[]) => {
        if(Array.isArray(song)){
            setAddedSongs([...addedSongs, ...song])
        } else {
            setAddedSongs([...addedSongs, song])
        }
    }

    const removeAddedSong = (docId:string) => {
        setAddedSongs(addedSongs.filter(song => song.docId !== docId))
    }

    return (
        <ClubContext.Provider value={{
            club,
            setClub,
            addedSongs,
            updateAddedSongs,
            removeAddedSong
        }}>
            {children}
        </ClubContext.Provider>
    )   
}

export const useClub = () => useContext(ClubContext)
