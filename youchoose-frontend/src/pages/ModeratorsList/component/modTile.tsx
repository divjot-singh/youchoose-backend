import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useCommonComponents } from '../../../providers/commonComponentsProvider'

const ModTile = ({email, onDelete, isMe=false}:{email:string, onDelete:(email:string) => void, isMe?:boolean}) => {
    const {showPopup, hidePopup} = useCommonComponents()
    const getPopupContent = () => {
        return (
            <div className='deletion-content'>
                <p>Are you sure you want to delete the moderator?</p>
                <div className='ctas'>
                    <button type='button' className='outlined' onClick={hidePopup}>Cancel</button>
                    <button type='submit' className='primary' onClick={()=>onDelete(email)}>Yes</button>
                </div>
            </div>
        )
    }
    const handleDelete = () => {
        showPopup({
            children:getPopupContent()
        })
    }
    return (
        <div className={`mod-tile ${isMe ? 'me' : ''}`}>
            <div className='content'>{email}{isMe? <span>{'(You)'}</span> : ''}</div>
            {!isMe ? <span className='delete-icon' onClick={handleDelete}><FaTrash color='red' size={20} /></span> : ''}
        </div>
    )
}

export default ModTile