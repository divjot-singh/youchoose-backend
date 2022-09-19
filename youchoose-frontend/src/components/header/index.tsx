import React from 'react'
import './index.scss'
import Logo from '../../assets/logo.png';
import { FaArrowLeft, FaBackward, FaBars } from "react-icons/fa";
import { useAuth } from '../../providers/userProvider';
import { useNavigate } from 'react-router-dom';

const Header = ({pageName, showBackButton = false}:{pageName:string, showBackButton?:boolean}) => {
    const {user} = useAuth()
    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
    }
    return (
        <>
            <header className={`header content ${user ? '' : 'center'}`}>
                <div className={`logo header-child`}><img src={Logo} alt='' /></div>    
                {user && <div className='placeholder header-child'><FaBars color='white' size={30} /></div>}
            </header>
            <div className='page-name content'> <span onClick={showBackButton ? goBack : undefined}>{showBackButton && <FaArrowLeft color='white' size={30} />}</span>{pageName}<span></span></div>
        </>
    )
}

export default Header