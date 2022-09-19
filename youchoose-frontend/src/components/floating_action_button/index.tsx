import React, { MouseEventHandler } from 'react'
import './index.scss'


export enum FabPosition{
    left='left',
    right='right',
    center='center'
}

export interface FloatingActionButtonProps{
    onClick:MouseEventHandler,
    children:JSX.Element | string,
    position:FabPosition
}

const FloatingActionButton = ({children, onClick, position}:FloatingActionButtonProps) => {
    return (
        <button className={`floating-action-button position-${position}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default FloatingActionButton