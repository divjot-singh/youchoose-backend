import React from 'react'
import { FaTimes } from 'react-icons/fa'
import './index.scss'

const Popup = ({children, onClose, className='', overlayClassName=''}:{children:JSX.Element| null,onClose:() => void, className?:string, overlayClassName?:string}) => {
    return (
        <div className={`popup-container ${overlayClassName}`}>
            <div className={`popup ${className}`}>
                <span className='close-icon' onClick={onClose}><FaTimes color='#19183c' size={20} /></span>
                <div className='popup-content'>
                    {children}
                </div>
            </div>
        </div>
    )
}   

export default Popup