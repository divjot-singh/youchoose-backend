import React from 'react'
import Song from '../../entities/song'
import { useAuth } from '../../providers/userProvider'
import './index.scss'
import { FaPlusCircle, FaHeart, FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import NetworkService from '../../services/networkService';
import { API_ENDPOINTS } from '../../utils/apiEndpoints';
import { useClub } from '../../providers/clubProvider';
import { useCommonComponents } from '../../providers/commonComponentsProvider';
import { SnackbarTypes } from '../snackbar';
import { useAddedSongs } from '../../providers/addedSongsProvider';
import { UserType } from '../../entities/user';
import { useLikedSongs } from '../../providers/likedSongsProvider';

const SongItem = ({song, onSongAddition, canUserRemoveSong=true}:{song:Song, onSongAddition?:(song:Song) => void, canUserRemoveSong?:boolean}) => {
    const {user} = useAuth()
    const {club, addedSongs, updateAddedSongs, removeAddedSong} = useClub()
    const {likedSongs, addLikedSong, removeLikedSong} = useLikedSongs()
    const {songs, updateSongs} = useAddedSongs()
    const {showSnackbar} = useCommonComponents()
    const addedSongIndex = addedSongs.findIndex((userSuggestedSong) => userSuggestedSong.videoId === song.videoId )
    const isSongRemovable:boolean = addedSongIndex > -1 && canUserRemoveSong
    const isSongAdded:boolean = songs.findIndex((userAddedSong) => userAddedSong.videoId === song.videoId ) > -1 || isSongRemovable
    const isLiked = likedSongs.findIndex((userLikedSong:Song) => userLikedSong.videoId === song.videoId) > -1
    const addSuggestedSong = async () => {
        if(!club?.clubId){
            showSnackbar({
                children:<span>No club selected. Please go back and select a club</span>,
                type: SnackbarTypes.ERROR
            })
            return;
        };
        try{
            const data = await NetworkService.post({
                url:API_ENDPOINTS.addSuggestedSong,
                data:{
                    userId:user?.uid,
                    clubId:club?.clubId,
                    song:song
                }
            })
            if(data && data['docId']){
                updateAddedSongs({...song, docId:data['docId']})
                showSnackbar({
                    children:<span>Song added</span>,
                    type:SnackbarTypes.SUCCESS
                })
            } else {
                showSnackbar({
                    children:<span>Could not add song.</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Could not add song.</span>,
                type:SnackbarTypes.ERROR
            })
        }
        
    }
    const removeSuggestedSong = async () => {
        try{
            const removableSong:Song = addedSongs[addedSongIndex]
            if(removableSong && removableSong?.docId){
                const data = await NetworkService.post({
                    url:API_ENDPOINTS.removeSuggestedSong,
                    data:{
                        clubId:club?.clubId,
                        docId:removableSong.docId
                    }
                })
                console.log(data)
                if(data && Object.hasOwn(data, 'error')){
                    showSnackbar({
                        children:<span>Could not remove song.</span>,
                        type:SnackbarTypes.ERROR
                    })
                } else{
                    showSnackbar({
                        children:<span>Song removed.</span>,
                        type:SnackbarTypes.SUCCESS
                    })
                    removeAddedSong(removableSong.docId)
                }
            } else{
                showSnackbar({
                    children:<span>Could not remove song.</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Could not remove song.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const addSongToList = async () => {
        if(!club?.clubId){
            showSnackbar({
                children:<span>No club selected. Please go back and select a club</span>,
                type: SnackbarTypes.ERROR
            })
            return;
        };
        try{
            const data = await NetworkService.post({
                url:API_ENDPOINTS.addSongToList,
                data:{
                    clubId:club?.clubId,
                    song:song
                }
            })
            if(onSongAddition) onSongAddition(song)
            if(data && data['docId']){
                showSnackbar({
                    children:<span>Song added</span>,
                    type:SnackbarTypes.SUCCESS
                })
            } else {
                showSnackbar({
                    children:<span>Could not add song.</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Could not add song.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const removeSongFromList = async () => {
        if(!club?.clubId){
            showSnackbar({
                children:<span>No club selected. Please go back and select a club</span>,
                type: SnackbarTypes.ERROR
            })
            return;
        };
        try{
            const data = await NetworkService.post({
                url:API_ENDPOINTS.removeSongFromList,
                data:{
                    clubId:club?.clubId,
                    song:song
                }
            })
            if(data && data['error']){
                showSnackbar({
                    children:<span>Could not remove song.</span>,
                    type:SnackbarTypes.ERROR
                })
                
            } else {
                updateSongs(songs.filter((addedSong:Song) => addedSong.videoId !== song.videoId))
                showSnackbar({
                    children:<span>Song removed</span>,
                    type:SnackbarTypes.SUCCESS
                })
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Could not remove song.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const likeUnlikeSong = async () => {
        if(!user) return
        try{
            let res = await NetworkService.post({
                url:API_ENDPOINTS.likeUnlikeSong,
                data:{
                    userId:user?.uid,
                    song:song
                }
            })
            console.log(res)
            if(res && res['error']){
                console.error(res)
                showSnackbar({
                    children:<span>Something went wrong.</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                if(isLiked){
                    removeLikedSong(song)
                } else {
                    addLikedSong(song)
                }
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Something went wrong.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const getCtas = () => {
        if(user?.user_type === UserType.DJ){
            return <div className='ctas'>
                {isSongAdded ? <span onClick={removeSongFromList}><FaMinusCircle color='white' size={20}  /></span> :<span onClick={addSongToList}><FaPlusCircle color='white' size={20}  /></span>}
            </div>
        }
        return (
            <div className='ctas'>
                {isSongAdded ? isSongRemovable ? <span onClick={removeSuggestedSong}><FaMinusCircle color='white' size={20}  /></span> : <span><FaCheckCircle color='white' size={20}  /></span>  : <span onClick={addSuggestedSong}><FaPlusCircle color='white' size={20}  /></span>}
                {user && <span onClick={likeUnlikeSong}><FaHeart color={isLiked ? 'red' :'white'} size={20}  /> </span>}
            </div>
        )
    }
    return <div className='song-item'>
        <img src={song.imageUrl} alt="" />
        <p>{song.title}</p>
        {getCtas()}
    </div>
}

export default SongItem