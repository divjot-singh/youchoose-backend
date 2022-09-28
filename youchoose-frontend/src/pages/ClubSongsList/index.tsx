import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingActionButton, { FabPosition } from '../../components/floating_action_button'
import Header from '../../components/header'
import { SnackbarTypes } from '../../components/snackbar'
import SongItem, { SongItemPages } from '../../components/songItem'
import Song, { instanceOfSong } from '../../entities/song'
import { UserType } from '../../entities/user'
import { useClub } from '../../providers/clubProvider'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import { useAuth } from '../../providers/userProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import { RoutesKeys } from '../../utils/routes'
import './index.scss'

const ClubSongsList = () => {
    const {club, clubSongsList, updateClubSongs} = useClub()
    const navigate = useNavigate()
    const {user} = useAuth()
    const {showSnackbar, showLoader, hideLoader} = useCommonComponents()
    const fetchClubSongs = async () => {
        showLoader(null)
        try{
            const data = await NetworkService.get({
                url: API_ENDPOINTS.clubSongs,
                data:{
                    clubId:club?.clubId,
                }
            })
            hideLoader()
            if(Array.isArray(data)){
                if(instanceOfSong(data[0])) updateClubSongs(data)
            } else {
                showSnackbar({
                    children:<span>Cound not fetch club songs</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            hideLoader()
            showSnackbar({
                children:<span>Cound not fetch club songs</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    useEffect(() => {
        if(!club){
            navigate(RoutesKeys.SELECT_CLUB, {
                replace:true
            })
        } else{
            fetchClubSongs()
        }
    },[])
    const getSongs = () => {
        if(clubSongsList.length){
            return clubSongsList.map((song:Song) => <SongItem song={song} key={song.videoId} pageType={SongItemPages.SONGS_LIST} /> )
        } else{
            return <div className='empty-state'>No songs added yet</div>
        }
    }
    return (
        <>
            <Header pageName={`Songs list for ${club?.clubName}`} showBackButton={user?.user_type !== UserType.DJ} />
            <div className='songs-list-container container content'>
                {getSongs()}
            </div>
        </>
    )
}

export default ClubSongsList