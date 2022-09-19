import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import { SnackbarTypes } from '../../components/snackbar'
import SongItem from '../../components/songItem'
import Song from '../../entities/song'
import { UserType } from '../../entities/user'
import { useClub } from '../../providers/clubProvider'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import { useAuth } from '../../providers/userProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import { RoutesKeys } from '../../utils/routes'
import './index.scss'

const SuggestedSongsList = () => {
    const {club} = useClub()
    const {user} = useAuth()
    const navigate = useNavigate()
    const [songsList, setSongsList] = useState<Song[]>([])
    const {showLoader, showSnackbar, hideLoader} = useCommonComponents()
    const fetchSuggestedSongsList = async () => {
        try{
            showLoader(null)
            const songsResponse = await NetworkService.get({
                url:API_ENDPOINTS.suggestedSongsList,
                data:{ clubId:club?.clubId}
            })
            hideLoader()
            if(Array.isArray(songsResponse)) setSongsList(songsResponse)
            else{
                console.error(songsResponse)
                showSnackbar({
                    children:<span>Cound not fetch suggested songs</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(e){
            hideLoader()
            showSnackbar({
                children:<span>Cound not fetch suggested songs</span>,
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
            fetchSuggestedSongsList()
        }
    },[])
    const onSongAddition = async (removableSong:Song) => {
        try{
            setSongsList(songsList.filter((song:Song) => {
                return song.videoId !== removableSong.videoId
            }))
            await NetworkService.post({
                url:API_ENDPOINTS.removeSongsFromSuggestion,
                data:{
                    songId:removableSong.videoId,
                    clubId:club?.clubId
                }
            })
        } catch(err){
            console.error(err)
        }
    }
    const getSongs = () => {
        if(songsList.length){
            return songsList.map((song) => <SongItem song={song} key={song.videoId} onSongAddition={onSongAddition} canUserRemoveSong={!user || user?.user_type === UserType.USER }/> )
        } else{
            return <div className='empty-state'>No songs added yet</div>
        }
    }
    return (
        <>
            <Header pageName={`Suggested songs for ${club?.clubName}`} showBackButton={true} />
            <div className='songs-list-container container content'>
                {getSongs()}
            </div>
        </>
    )
}

export default SuggestedSongsList