import { createContext, useContext, useState } from "react"
import Song from "../entities/song"


export interface AddedSongsContextType{
    songs:Song[],
    updateSongs:(songs:Song[]) => void,
    clearSongs:() => void,
}

export const AddedSongsContext = createContext<AddedSongsContextType>({
    songs:[],
    updateSongs:(songs:Song[]) => {},
    clearSongs:() => {}
})

export const AddedSongsProvider = ({ children}:{children:JSX.Element | null}) => {

    const [addedSongs, setAddedSongs] = useState<Song[]>([])

    const updateSongs = (songs:Song[]) => {
        setAddedSongs(songs)
    }

    const clearSongs = () => {
        setAddedSongs([])
    }

    return (
        <AddedSongsContext.Provider value={{
            songs:addedSongs,
            updateSongs,
            clearSongs
        }}>
            {children}
        </AddedSongsContext.Provider>
    )   
}

export const useAddedSongs = () => useContext(AddedSongsContext)
