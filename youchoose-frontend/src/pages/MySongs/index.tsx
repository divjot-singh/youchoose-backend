import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import { SnackbarTypes } from '../../components/snackbar'
import SongItem, { SongItemPages } from '../../components/songItem'
import { instanceOfSong } from '../../entities/song'
import { UserType } from '../../entities/user'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import { useLikedSongs } from '../../providers/likedSongsProvider'
import { useAuth } from '../../providers/userProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import { RoutesKeys } from '../../utils/routes'
import './index.scss'

const MySongs = () => {
    const {user } = useAuth()
    const navigate = useNavigate()
    const {likedSongs, initialiseLikedSongs} = useLikedSongs()

    useEffect(() => {
        if(user && user.user_type !== UserType.USER){
            navigate(RoutesKeys.SELECT_CLUB)
        } else {
            initialiseLikedSongs(true)
        }
    },[user])
    const getSongs = () => {
        if(likedSongs.length){
            return likedSongs.map((song) => <SongItem song={song} key={song.videoId} pageType={SongItemPages.MY_SONGS}/> )
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