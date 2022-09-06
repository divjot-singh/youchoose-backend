import { createContext, useContext, useState } from "react"
import Club from "../entities/club"


export interface ClubContextType{
    setClub:(club:Club) => void,
    club:Club | undefined
}

export const ClubContext = createContext<ClubContextType>({
    setClub:(club:Club) => {},
    club:undefined
})

export const ClubProvider = ({ children}:{children:JSX.Element | null}) => {

    const [club, setClub] = useState<Club | undefined>()
    return (
        <ClubContext.Provider value={{
            club,
            setClub
        }}>
            {children}
        </ClubContext.Provider>
    )   
}

export const useClub = () => useContext(ClubContext)
