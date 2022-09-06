import React from 'react'
import './index.scss'

const Header = ({pageName}:{pageName:string}) => {
    return (
        <header className='header'>
            <div className='logo header-child'>Youchoose</div>
            <div className='page-name header-child'>{pageName}</div>
            <div className='placeholder header-child'></div>
        </header>
    )
}

export default Header