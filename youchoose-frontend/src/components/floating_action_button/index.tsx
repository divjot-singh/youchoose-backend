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
    position:FabPosition,
    isRound?:boolean
}

const FloatingActionButton = ({children, onClick, position, isRound=false}:FloatingActionButtonProps) => {
    return (
        <button className={`floating-action-button ${isRound ? 'round' : ''} position-${position}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default FloatingActionButton