import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoutesKeys } from '../../utils/routes'


const Home = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(RoutesKeys.SELECT_CLUB)
    },[])
    return <div></div>
}

export default Home