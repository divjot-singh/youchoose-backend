import React from 'react'
import LoadingOverlay from 'react-loading-overlay'
import './index.scss'

const FullScreenLoader = ({ children, text }) => {
  if (!text) {
    text = `Loading ...`
  }
  return (
    <LoadingOverlay
      active={true}
      spinner
      text={text}
      className="full-screen-loader"
    >
      {children}
    </LoadingOverlay>
  )
}

export default FullScreenLoader
