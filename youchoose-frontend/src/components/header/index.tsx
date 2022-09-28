import React, { useState } from 'react'
import './index.scss'
import Logo from '../../assets/logo.png';
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from '../../providers/userProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserType } from '../../entities/user';
import { RoutesKeys } from '../../utils/routes';
import { useClub } from '../../providers/clubProvider';
import { useLikedSongs } from '../../providers/likedSongsProvider';
import { useSuggestedSongs } from '../../providers/addedSongsProvider';

export interface MenuItem{
    name:string;
    onClick:() => void
}

const Header = ({pageName, showBackButton = false}:{pageName:string, showBackButton?:boolean}) => {
    const {user} = useAuth()
    const navigate = useNavigate()
    const {club} = useClub()
    const {onSignOut} = useLikedSongs()
    const {clearUserSuggestedSongs} = useSuggestedSongs()
    const location = useLocation()
    const goBack = () => {
        navigate(-1)
    }
    const {signOut} = useAuth()
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const getMenuItems = ():MenuItem[] => {
        let menuItems:MenuItem[] = [{
            name:'Log out',
            onClick:async () =>{
                onSignOut()
                clearUserSuggestedSongs()
                await signOut()
                navigate(RoutesKeys.LOGIN)
            }
        }]
        if(user?.user_type === UserType.USER){
            if(location.pathname !== RoutesKeys.MY_SONGS && user.email) {
                menuItems.unshift({
                    name:'My Songs',
                    onClick:() => {
                        navigate(RoutesKeys.MY_SONGS)
                    }
                })
            } 
            if(location.pathname !== RoutesKeys.SELECT_CLUB) {
                menuItems.unshift({
                    name:'Select club',
                    onClick:() => {
                        navigate(RoutesKeys.SELECT_CLUB)
                    }
                })
            }
            if(location.pathname !== RoutesKeys.CLUB_SONG_LIST && location.pathname !== RoutesKeys.SELECT_CLUB && club){
                menuItems.unshift({
                    name:'Club songs',
                    onClick:() => {
                        navigate(RoutesKeys.CLUB_SONG_LIST)
                    }
                })
            }
        } else if(user?.user_type === UserType.DJ && user.club){
            if(location.pathname !== RoutesKeys.CLUB_SONG_LIST) {
                menuItems.unshift({
                    name:'Songs list',
                onClick:() => {
                    navigate(RoutesKeys.CLUB_SONG_LIST)
                }
                })
            }
        } else if(user?.user_type === UserType.MODERATOR){
            if(location.pathname !== RoutesKeys.CLUBS_LIST) {
                menuItems.unshift({
                    name:'Clubs list',
                    onClick:() => {
                        navigate(RoutesKeys.CLUBS_LIST)
                    }
                })
            } 
            if(location.pathname !== RoutesKeys.MODERATORS_LIST) {
                menuItems.unshift({
                    name:'Moderators list',
                    onClick:() => {
                        navigate(RoutesKeys.MODERATORS_LIST)
                    }
                })
            } 
        }
        return menuItems;
    }
    return (
        <>
            <header className={`header content ${user ? '' : 'center'}`}>
                <div className={`logo header-child`}><img src={Logo} alt='' /></div>    
                {user && <div className='menu-icon header-child' onClick={() => setShowMenu(true)}><FaBars color='white' size={30} /></div>}
                {user && <div className={`header-menu ${showMenu ? 'show' : ''}`}>
                    {getMenuItems().length ? <span className='close-icon' onClick={() => setShowMenu(false)}><FaTimes color="white" size={30} /></span> : null}
                    <ul>
                        {getMenuItems().map((menuItem:MenuItem, index:number) => {
                            return <li key={index} className='menu-item' onClick={menuItem.onClick}>{menuItem.name}</li>
                        })}
                    </ul>
                </div>}
            </header>
            <div className='page-name content'> <span onClick={showBackButton ? goBack : undefined}>{showBackButton && <FaArrowLeft color='white' size={30} />}</span>{pageName}<span></span></div>
        </>
    )
}

export default Header