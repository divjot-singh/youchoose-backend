import React from 'react'
import Song from '../../entities/song'
import { useAuth } from '../../providers/userProvider'
import './index.scss'
import { FaPlusCircle, FaHeart } from "react-icons/fa";

const SongItem = ({song}:{song:Song}) => {
    const {user} = useAuth()
    const getCtas = () => {
        return (
            <div className='ctas'>
                <FaPlusCircle color='white' size={20}  />
                {user && <FaHeart color='white' size={20}  /> }
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