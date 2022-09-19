import React, {  useEffect, useState } from 'react'
import Header from '../../components/header'
import { useDebounce } from 'usehooks-ts'
import './index.scss'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import Song, { getSongFromMap } from '../../entities/song'
import { SnackbarTypes } from '../../components/snackbar'
import SongItem from '../../components/songItem'
import './index.scss'
import { FaSearch } from 'react-icons/fa'
import FloatingActionButton, { FabPosition } from '../../components/floating_action_button'
import { useNavigate } from 'react-router-dom'
import { RoutesKeys } from '../../utils/routes'


const SelectSongs = () => {
    const [query, setQuery] = useState<string>('')
    const debouncedValue = useDebounce<string>(query, 500)
    const [songs, setSongs] = useState<Song[]>([])
    const navigate = useNavigate()
    const {showLoader,hideLoader, showSnackbar} = useCommonComponents()
    const fetchSongs =  async (text:string) => {
        showLoader(null)
        try{
            const data = await NetworkService.get({url:`${API_ENDPOINTS.youtubeBaseUrl}${API_ENDPOINTS.youtubeSearch}`, isAbsoluteUrl:true, isYoutubeApiUrl:true, data:{
                q:text
            }})
           hideLoader()
            const songsResult:Song[] = data?.map((songItem:any) => {
                return getSongFromMap(songItem)
            })
            setSongs(songsResult)
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Cound not fetch songs</span>,
                type:SnackbarTypes.ERROR
            })
        }
        
    }
    useEffect(() => {
        if(debouncedValue?.length){
            fetchSongs(debouncedValue)
        }
    },[debouncedValue])

    const getSongsResults = () => {
        if(debouncedValue.length && songs.length){
            return songs.map((songItem) => <SongItem song={songItem} key={songItem.videoId} />)
        } else if(debouncedValue.length && !songs.length){
            return <p className='no-songs'>No songs found</p>
        }
    }
    return (
        <>
            <Header pageName='Select songs' showBackButton={true} />
            <div className='songs-container container content'>
                <div className='input-container'><input name='search' id='search' className='search-input' placeholder='Search a song' value={query} onChange={e => setQuery(e.target.value)} /><span className='icon' onClick={() => fetchSongs(debouncedValue)}><FaSearch color='white' size={20} /></span></div>
                <div className='song-list'>{getSongsResults()}</div>
            </div>
            <FloatingActionButton position={FabPosition.right} onClick={() => navigate(RoutesKeys.CLUB_SONG_LIST)}>SongsList</FloatingActionButton>
            <FloatingActionButton position={FabPosition.left} onClick={() => navigate(RoutesKeys.MY_SONGS)}>My songs</FloatingActionButton>
        </>
    )
}

export default SelectSongs