import Axios from 'axios'
import { API_ENDPOINTS } from '../utils/apiEndpoints'
import { LocalStorageKeys } from '../utils/localstorageKeys'
import LocalStorageMethods from './localstorageService'
import qs from 'qs'


let _getAxiosInstance = ({isAbsoluteUrl = false, isYoutubeApiUrl = false}) => {
  const headers:any =  {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const authToken = LocalStorageMethods.get(LocalStorageKeys.token)
  if (authToken){
    headers['Authorization'] = authToken
  }
  let axios = Axios.create({
    baseURL: isAbsoluteUrl ? '' : isYoutubeApiUrl ? API_ENDPOINTS.youtubeBaseUrl : process.env.REACT_APP_API_URL,
    timeout: 30000,
    headers: headers,
    params:isYoutubeApiUrl ? {
      part:'id,snippet',
      maxResults:50,
      key:process.env.REACT_APP_YOUTUBE_API_KEY,
      order:'rating'
    } : undefined,
    validateStatus: function (status) {
      return status >= 200 && status < 400
    },
  })

  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error && error.response && error.response.status === 401) {
        //LocalStorageMethods.clear()
        //window.location.reload()
      } else {
        return Promise.reject(error)
        // todo kr - form some model for error
      }
    }
  )

  return axios
}

export interface NetworkServicemethods{
    url:string;
    data?:object;
    isAbsoluteUrl?:boolean;
    isYoutubeApiUrl?:boolean
}

export enum NetworkServiceMethods{
    GET='GET',
    POST='POST'
}

export interface MakeRequestMethods{
    url:string;
    data?:object;
    isAbsoluteUrl?:boolean;
    type:NetworkServiceMethods;
    isYoutubeApiUrl?:boolean;
}

let _makeRequest = async ({url, type, data, isAbsoluteUrl, isYoutubeApiUrl}:MakeRequestMethods) => {
  let response:any

  try {
    if (type === 'GET') {
      response = await _getAxiosInstance({ isAbsoluteUrl, isYoutubeApiUrl }).get(url, { params: data })
    }
    
    if (type === 'POST') {
      response = await _getAxiosInstance({ isAbsoluteUrl, isYoutubeApiUrl }).post(url, qs.stringify(data))
    }

    if (response.data) {
      if(isYoutubeApiUrl){
        return response.data.items;
      } else if (response.data.success) {
        return Promise.resolve(response.data.data)
      } else {
        return _handleError(response.data.error)
      }
    }

  } catch (error) {
    return _handleError(error)
  }
}

let _handleError = (error:any) => {
  return Promise.resolve({
    'error': error
    // todo kr - form some model for error
  })
}



let NetworkService = {
  get: ({url, data, isAbsoluteUrl, isYoutubeApiUrl}:NetworkServicemethods) => {
    return _makeRequest({url, type: NetworkServiceMethods.GET, data, isAbsoluteUrl, isYoutubeApiUrl})
  },
  post: ({url, data, isAbsoluteUrl, isYoutubeApiUrl}:NetworkServicemethods) => {
    return _makeRequest({url, type: NetworkServiceMethods.POST, data, isAbsoluteUrl, isYoutubeApiUrl})
  }
}

export default NetworkService
