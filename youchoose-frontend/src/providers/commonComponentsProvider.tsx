import { type } from '@testing-library/user-event/dist/type'
import React, {
    createContext,
    useContext,
    useState,
} from 'react'
import FullScreenLoader from '../components/full_screen_loader'
import Snackbar, { SnackbarTypes } from '../components/snackbar'


export interface LoaderData{
    children:JSX.Element | null,
    text:string | null
}


export interface SnackbarData{
  children:JSX.Element | null | undefined,
  duration?:number,
  type?:SnackbarTypes,
  hideSnackbar?:() => void
}

export interface CommonComponentsContextValue{
    showLoader:(data:LoaderData | null) => void,
    hideLoader:() => void,
    hideSnackbar:() => void,
    showSnackbar:(data:SnackbarData) => void
}
const CommonComponentsContext = createContext<CommonComponentsContextValue>({
    showLoader:(data:LoaderData | null) => {},
    hideLoader:() => {},
    hideSnackbar:() => {},
    showSnackbar:(data:SnackbarData) => {}
})

export const CommonComponentsProvider = ({ children}:{children:JSX.Element | null}) => {
    const [loaderData, setLoaderData] = useState<LoaderData | null>(null)  
    const [snackbarData, setSnackbarData] = useState<SnackbarData | null>(null)
    const showLoader = (data:LoaderData | null) => {
      const { children = null, text = null } = data || {}
      setLoaderData({
        children,
        text,
      })
    }
  
    const hideLoader = () => {
      setLoaderData(null)
    }
    
    const showSnackbar = ({
      children = null,
      type = SnackbarTypes.SUCCESS,
      duration = 3000,
    }:SnackbarData) => {
      setSnackbarData({
        children,
        type,
        duration,
      })
    }
  
    const hideSnackbar = () => {
      setSnackbarData(null)
    }
  
    let { children: loaderChild, text } = loaderData || {}

    let {children: snackbarChild, duration, type} = snackbarData || {}
  
    return (
      <CommonComponentsContext.Provider
        value={{
          showLoader,
          hideLoader,
          showSnackbar,
          hideSnackbar
        }}
      >
        {snackbarData && (
        <Snackbar type={type} duration={duration} hideSnackbar={hideSnackbar}>
          {snackbarChild}
        </Snackbar>
      )}
        {loaderData && (
          <FullScreenLoader text={text}>{loaderChild}</FullScreenLoader>
        )}
        {children}
      </CommonComponentsContext.Provider>
    )
  }
  
  export const useCommonComponents = () => useContext(CommonComponentsContext)
  