import React from 'react'
import Header from '../../components/header'
import './index.scss'

const ErrorPage = () => {
    return (
        <>
            <Header pageName='Error page' />
            <div className='error container content'><h1>Something went wrong</h1></div>
        </>
    )
}

export default ErrorPage