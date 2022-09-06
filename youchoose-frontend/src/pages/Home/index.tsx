import React from 'react'
import { useAuth } from '../../providers/userProvider'


const Home = () => {
    const auth = useAuth()
    return <div onClick={auth.signOut}>Home</div>
}

export default Home