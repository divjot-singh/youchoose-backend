import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingActionButton, { FabPosition } from '../../components/floating_action_button'
import Header from '../../components/header'
import { SnackbarTypes } from '../../components/snackbar'
import SongItem from '../../components/songItem'
import { instanceOfSong } from '../../entities/song'
import { UserType } from '../../entities/user'
import { useAddedSongs } from '../../providers/addedSongsProvider'
import { useClub } from '../../providers/clubProvider'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import { useAuth } from '../../providers/userProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import { RoutesKeys } from '../../utils/routes'
import './index.scss'

const ClubSongsList = () => {
    const {club} = useClub()
    const navigate = useNavigate()
    const {songs} = useAddedSongs()
    const {user} = useAuth()
    const {updateSongs} = useAddedSongs()
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
                if(instanceOfSong(data[0])) updateSongs(data)
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
        if(songs.length){
            return songs.map((song) => <SongItem song={song} key={song.videoId} canUserRemoveSong={!!user && user.user_type === UserType.DJ}/> )
        } else{
            return <div className='empty-state'>No songs added yet</div>
        }
    }
    const showSuggestedSongs = () => {
        navigate(RoutesKeys.SUGGESTED_SONG_LIST)
    }
    return (
        <>
            <Header pageName={`Songs list for ${club?.clubName}`} showBackButton={user?.user_type !== UserType.DJ} />
            <div className='songs-list-container container content'>
                {getSongs()}
            </div>
            {user?.user_type === UserType.DJ && <FloatingActionButton position={FabPosition.left} onClick={showSuggestedSongs}>Show suggested songs</FloatingActionButton>}
        </>
    )
}

export default ClubSongsList