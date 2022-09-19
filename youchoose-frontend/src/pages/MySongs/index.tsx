import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import SongItem from '../../components/songItem'
import { UserType } from '../../entities/user'
import { useLikedSongs } from '../../providers/likedSongsProvider'
import { useAuth } from '../../providers/userProvider'
import { RoutesKeys } from '../../utils/routes'
import './index.scss'

const MySongs = () => {
    const {user } = useAuth()
    const navigate = useNavigate()
    const {likedSongs} = useLikedSongs()
    useEffect(() => {
        if(user && user.user_type !== UserType.USER){
            navigate(RoutesKeys.SELECT_CLUB)
        }
    },[user])
    const getSongs = () => {
        if(likedSongs.length){
            return likedSongs.map((song) => <SongItem song={song} key={song.videoId} canUserRemoveSong={false}/> )
        } else{
            return <div className='empty-state'>No songs liked yet</div>
        }
    }
    return (
        <>
            <Header pageName='My songs' showBackButton={true} />
            <div className='songs-list-container container content'>
                {getSongs()}
            </div>
        </>
    )
}

export default MySongs