import React, { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthType } from '../../services/authService'
import './index.scss'
import { useAuth, UserContextValue } from '../../providers/userProvider'
import Header from '../../components/header'
import { RoutesKeys } from '../../utils/routes'
import { instanceOfUser, UserType } from '../../entities/user'
import { useClub } from '../../providers/clubProvider'
import { useLikedSongs } from '../../providers/likedSongsProvider'


const Login = () => {
    const {authenticate, user}:UserContextValue = useAuth()
    const location = useLocation(), navigate = useNavigate()
    const {initialiseLikedSongs} = useLikedSongs()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {setClub, initialiseClubSongs} = useClub()
    const redirectToRouteIfAny = () => {
        const state:any = location.state || {}
        if(user?.user_type === UserType.USER){
            initialiseLikedSongs()
            navigate(RoutesKeys.SELECT_CLUB)
        } else if(user?.user_type === UserType.DJ && user.club){
            setClub(user.club)
            initialiseClubSongs()
            navigate(RoutesKeys.CLUB_SONG_LIST)
        }
        else if(user?.user_type === UserType.MODERATOR) {
            navigate(RoutesKeys.CLUBS_LIST)
        }
        else if(state['from'] && state['from'] !== '/'){
            navigate(state['from'])
        } else{
            navigate(RoutesKeys.ERROR_PAGE)
        }
    }
    useEffect(() => {
        console.log('login', user)
        if(user){
            redirectToRouteIfAny()
        }
    },[user])
    const signUpWithGoogle = () => {
        authenticate(AuthType.Google)
    }

    const handleEmailChange:ChangeEventHandler<HTMLInputElement> = (event:ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }


    const handlePwChange:ChangeEventHandler<HTMLInputElement> = (event:ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleSubmit:FormEventHandler<HTMLFormElement> = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        authenticate(AuthType.Email, email, password)
    }
    const continueWithoutSigning = () => {
        authenticate(AuthType.None)
    }
    return (
        <>
            <Header pageName='Login' />
            <div className='login-container container content'>
                <form className='signin-form' onSubmit={handleSubmit}>
                    <label className='label' htmlFor='email'>Email</label>
                    <input type='email' placeholder='Email' name='email' id='email' value={email} onChange={handleEmailChange} required />
                    <label className='label' htmlFor='password'>Password</label>
                    <input type='password' placeholder='Password' name='password' id='password' value={password} onChange={handlePwChange} required />
                    <button>Sign In</button>
                </form>
                <div className='register-line'>Don't have an account? <span onClick={() => navigate(RoutesKeys.REGISTER)}>Register.</span></div>
                <div className='or'>Or</div>
                <button onClick={signUpWithGoogle} className='google-signup-button'>Sign up with google</button>
                <div className='or'>Or</div>
                <button onClick={continueWithoutSigning}>Continue without Signing in</button>
            </div>
        </>
    )
}

export default Login