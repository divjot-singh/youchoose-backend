import { createContext, useContext, useState } from "react"
import Song from "../entities/song"


export interface AddedSongsContextType{
    userSuggestedSongs:Song[],
    updateUserSuggestedSongs:(songs:Song[]) => void,
    clearUserSuggestedSongs:() => void,
}

export const UserSuggestedSongsContext = createContext<AddedSongsContextType>({
    userSuggestedSongs:[],
    updateUserSuggestedSongs:(songs:Song[]) => {},
    clearUserSuggestedSongs:() => {}
})

export const UserSuggestedSongsProvider = ({ children}:{children:JSX.Element | null}) => {

    const [userSuggestedSongs, setUserSuggestedSongs] = useState<Song[]>([])

    const updateUserSuggestedSongs = (songs:Song[]) => {
        setUserSuggestedSongs(songs)
    }

    const clearUserSuggestedSongs = () => {
        setUserSuggestedSongs([])
    }

    return (
        <UserSuggestedSongsContext.Provider value={{
            userSuggestedSongs:userSuggestedSongs,
            updateUserSuggestedSongs: updateUserSuggestedSongs,
            clearUserSuggestedSongs: clearUserSuggestedSongs
        }}>
            {children}
        </UserSuggestedSongsContext.Provider>
    )   
}

export const useSuggestedSongs = () => useContext(UserSuggestedSongsContext)
