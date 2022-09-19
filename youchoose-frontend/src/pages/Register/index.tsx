import React, { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import { UserContextValue, useAuth } from '../../providers/userProvider'
import { AuthType } from '../../services/authService'
import { RoutesKeys } from '../../utils/routes'

const Register = () => {
    const [email, setEmail] = useState<string>()
    const navigate = useNavigate()
    const [password, setPassword] = useState<string>()
    const [username, setUsername] = useState<string>()
    
    const {authenticate, user}:UserContextValue = useAuth()
    const redirectToRouteIfAny = () => {
        navigate(RoutesKeys.SELECT_CLUB)
    }
    useEffect(() => {
        if(user){
            redirectToRouteIfAny()
        }
    },[user])

    const handleEmailChange:ChangeEventHandler<HTMLInputElement> = (event:ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }


    const handlePwChange:ChangeEventHandler<HTMLInputElement> = (event:ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleNameChange:ChangeEventHandler<HTMLInputElement> = (event:ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleSubmit:FormEventHandler<HTMLFormElement> = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        authenticate(AuthType.Register, email, password, username)
    }
    return (
        <>
        <Header pageName='Register' />
        <div className='login-container container content'>
            <form className='signin-form' onSubmit={handleSubmit}>
                <label className='label' htmlFor='name'>Username</label>
                <input type='text' placeholder='Name' name='name' id='name' value={username} onChange={handleNameChange} required />
                <label className='label' htmlFor='email'>Email</label>
                <input type='email' placeholder='Email' name='email' id='email' value={email} onChange={handleEmailChange} required />
                <label className='label' htmlFor='password'>Password</label>
                <input type='password' placeholder='Password' name='password' id='password' value={password} onChange={handlePwChange} required />
                <button>Sign Up</button>
            </form>
            <div className='login-line'>Already have an account? <span onClick={() => navigate(RoutesKeys.LOGIN)}>Login.</span></div>
        </div>
    </>
    )
}

export default Register