import React, { MouseEventHandler } from 'react'
import Song from '../../entities/song'
import { useAuth } from '../../providers/userProvider'
import './index.scss'
import { FaPlusCircle, FaHeart, FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import NetworkService from '../../services/networkService';
import { API_ENDPOINTS } from '../../utils/apiEndpoints';
import { useClub } from '../../providers/clubProvider';
import { useCommonComponents } from '../../providers/commonComponentsProvider';
import { SnackbarTypes } from '../snackbar';
import { useSuggestedSongs } from '../../providers/addedSongsProvider';
import { UserType } from '../../entities/user';
import { useLikedSongs } from '../../providers/likedSongsProvider';


export const enum SongItemPages{
    MY_SONGS = 'my_songs',
    SONGS_LIST = 'songs_list',
    SONG_SEARCH = 'song_search'
}

const LikeComponent = ({likes, isLiked, onClick}:{likes?:number, isLiked:boolean, onClick?:MouseEventHandler<HTMLSpanElement>}) => {
    return (
        <span className={`like-component ${isLiked ? 'liked' : ''}`} onClick={onClick}>
            <FaHeart color={isLiked ? 'red' :'white'} size={25}/>
            {likes ? <span className='like-count'>{likes}</span> : ''}
        </span>
    )
}

const SongItem = ({song, pageType}:{song:Song, pageType:SongItemPages}) => {
    const {user} = useAuth()
    const {club, clubSongsList, updateClubSongs} = useClub()
    const {likedSongs, addLikedSong, removeLikedSong} = useLikedSongs()
    const {showSnackbar} = useCommonComponents()
    const {userSuggestedSongs,updateUserSuggestedSongs} = useSuggestedSongs()
    const isUserSuggestedSong = userSuggestedSongs.findIndex(userSuggestedSong => userSuggestedSong.videoId === song.videoId) > -1
    const isSongAdded:boolean = clubSongsList.findIndex((userAddedSong => userAddedSong.videoId === song.videoId)) > -1 && isUserSuggestedSong
    const isLiked = likedSongs.findIndex((userLikedSong:Song) => userLikedSong.videoId === song.videoId) > -1
    console.log('isUserSiggested', userSuggestedSongs)
    console.log(isUserSuggestedSong)
    const unlikeSong = async () => {
        try{
            let data = await NetworkService.post({
                url:API_ENDPOINTS.unlikeSong,
                data:{
                    song:song,
                    userId:user?.uid
                }
            })
            if(data && data['error']){
                console.error(data)
                showSnackbar({
                    children:<span>Could not unlike song.</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                removeLikedSong(song)
            }
        } catch(err){
            console.error(err)
                showSnackbar({
                    children:<span>Could not unlike song.</span>,
                    type:SnackbarTypes.ERROR
                })
        }
    }
    const likeSong = async () => {
        try{
            let data = await NetworkService.post({
                url:API_ENDPOINTS.likeSong,
                data:{
                    song:song,
                    userId:user?.uid
                }
            })
            if(data && data['error']){
                console.error(data)
                showSnackbar({
                    children:<span>Could not like song.</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                addLikedSong(song)
            }
        } catch(err){
            console.error(err)
                showSnackbar({
                    children:<span>Could not like song.</span>,
                    type:SnackbarTypes.ERROR
                })
        }
    }
    const removeSuggestedSong = async () => {
        try{
            const data = await NetworkService.post({
                url:API_ENDPOINTS.removeSuggestedSong,
                data:{
                    clubId:club?.clubId,
                    songId:song.videoId,
                    userId:user?.uid
                }
            })
            unlikeSong()
            console.log(data)
            if(data && data['error']){
                showSnackbar({
                    children:<span>Could not remove song.</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                showSnackbar({
                    children:<span>Song removed.</span>,
                    type:SnackbarTypes.SUCCESS
                })
                let updatedSong = {...song, likes:data['likes']}
                updateClubSongs(updatedSong)
                updateUserSuggestedSongs(userSuggestedSongs.filter(clubSong => clubSong.videoId !== song.videoId))

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
            console.log(user)
            const data = await NetworkService.post({
                url:API_ENDPOINTS.addSongToList,
                data:{
                    clubId:club?.clubId,
                    song:song,
                    userId:user?.uid
                }
            })
            await NetworkService.post({
                url:API_ENDPOINTS.likeSong,
                data:{
                    song:song,
                    userId:user?.uid
                }
            })
            console.log('updating')
            let updatedSong = {...song, likes:data['likes']}
            console.log(updatedSong)
            updateClubSongs(updatedSong)
            addLikedSong(updatedSong)
            updateUserSuggestedSongs([...userSuggestedSongs, updatedSong])
            if(data && data['error']){
                showSnackbar({
                    children:<span>Could not add song.</span>,
                    type:SnackbarTypes.ERROR
                })
            } else {
                showSnackbar({
                    children:<span>Song added</span>,
                    type:SnackbarTypes.SUCCESS
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
                    songId:song.videoId,
                    userId:user?.uid
                }
            })
            unlikeSong()
            if(data && data['error']){
                showSnackbar({
                    children:<span>Could not remove song.</span>,
                    type:SnackbarTypes.ERROR
                })
                
            } else {
                updateClubSongs(clubSongsList.filter((addedSong:Song) => addedSong.videoId !== song.videoId))
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
    const onLikeClick = () => {
        if(isLiked){
            removeSuggestedSong()
        } else if(isUserSuggestedSong){
            likeSong()
        } else {
            addSongToList()
        }
    }
    const getCtas = () => {
        if(pageType === SongItemPages.SONG_SEARCH){
            return isSongAdded ? <span><FaCheckCircle color='white' size={20}  /></span> : <span onClick={addSongToList}><FaPlusCircle color='white' size={20}  /></span>
        } else if(pageType === SongItemPages.SONGS_LIST){
            if(user?.user_type === UserType.MODERATOR){
                return (
                    <>
                        <LikeComponent likes={song.likes} isLiked={isLiked} />
                        <span onClick={removeSongFromList}><FaMinusCircle color='white' size={20}  /></span>
                    </>
                )
            } else{
                return <LikeComponent likes={song.likes} isLiked={isLiked} onClick={onLikeClick} />
            }
        } else if(pageType === SongItemPages.MY_SONGS){
            return (
                    <>
                        <LikeComponent isLiked={isLiked} onClick={unlikeSong}/>
                    </>
            )
        }
    }
    return <div className='song-item'>
        <img src={song.imageUrl} alt="" />
        <p>{song.title}</p>
        <div className='ctas'>
            {getCtas()}
        </div>
    </div>
}

export default SongItem