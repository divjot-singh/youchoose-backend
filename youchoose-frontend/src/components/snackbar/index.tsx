import React, { useEffect } from 'react'
import { SnackbarData } from '../../providers/commonComponentsProvider'
import './index.scss'


export enum SnackbarTypes {
  ERROR = 'error',
  SUCCESS= 'success',
  INFO= 'info'
}

const Snackbar = ({
  type = SnackbarTypes.SUCCESS,
  duration = 5000,
  children,
  hideSnackbar,
}:SnackbarData) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      hideSnackbar?.()
    }, duration)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="snackbar-container">
      <div className={`snackbar ${type}`}>
        {children}
      </div>
    </div>
  )
}

export default Snackbar
