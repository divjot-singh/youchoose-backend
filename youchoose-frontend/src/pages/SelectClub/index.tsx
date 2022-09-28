import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import Club, { instanceOfClub } from '../../entities/club'
import { Error as AppError } from '../../entities/error'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import './index.scss'
import {fuzzySearchWrapper} from '../../utils/fuzzySearch'
import { useClub } from '../../providers/clubProvider'
import {SelectedOptionValue, SelectedOption, SelectSearchProps} from 'react-select-search'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import {  useNavigate } from 'react-router-dom'
import { RoutesKeys } from '../../utils/routes'
import { SnackbarTypes } from '../../components/snackbar'
import { useAuth } from '../../providers/userProvider'
import Song, { instanceOfSong } from '../../entities/song'
import { useSuggestedSongs } from '../../providers/addedSongsProvider'
import { UserType } from '../../entities/user'
import { useLikedSongs } from '../../providers/likedSongsProvider'


const SelectClub = () => {
    const [clubs, setClubs] = useState<Club[]>([])
    const {showLoader,hideLoader, showSnackbar} = useCommonComponents()
    const navigate = useNavigate()
    const {initialiseLikedSongs} = useLikedSongs()
    let isFetchingClubs = false
    const fetchClubs = async () => {
        if(isFetchingClubs) return
        showLoader(null)
        isFetchingClubs = true
        try{
            const clubsResponse: Club[] | null | AppError = await NetworkService.get({url:API_ENDPOINTS.fetchClubs})
            hideLoader()
            if(Array.isArray(clubsResponse) && instanceOfClub(clubsResponse[0])){
                setClubs(clubsResponse)
            } else {
                showSnackbar({
                    children:<span>Cound not fetch clubs</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            hideLoader()
            console.error(err)
            showSnackbar({
                children:<span>Cound not fetch clubs</span>,
                type:SnackbarTypes.ERROR
            })
            
        }
    }
    const {club, setClub, initialiseClubSongs} = useClub()
    const {user} = useAuth()
    const { updateUserSuggestedSongs } = useSuggestedSongs()
    useEffect(() => {
        fetchClubs()
    },[])
    useEffect(() => {
        if(user && user.user_type === UserType.DJ && user.club){
            setClub(user.club)
            navigate(RoutesKeys.CLUB_SONG_LIST)
        } else if(user&& user.user_type === UserType.USER){
            initialiseLikedSongs()
        }
    },[user])
    const options = clubs.map((club) => {
        return {
            name:club.clubName,
            value:club.clubId
        }
    })
    const handleChange = (value:SelectedOptionValue | SelectedOptionValue[], selectedOption: SelectedOption | SelectedOption[], optionSnapshot: SelectSearchProps) => {
        let clubId = Array.isArray(value) ? value[0].toString() : value.toString()
        let selectedClub= clubs.find((club) => club.clubId === clubId)
        if(selectedClub){
            setClub(selectedClub)
        }
    }
    const fetchUserSuggestedSongs = async () => {
        if(!user || !user.uid) return
        const data = await NetworkService.get({
            url: API_ENDPOINTS.userSuggestedSong,
            data:{
                clubId:club?.clubId,
                userId:user.uid
            }
        })
        if(Array.isArray(data)){
            if(instanceOfSong(data[0])) updateUserSuggestedSongs(data)
        } else {
            showSnackbar({
                children:<span>Cound not fetch user suggested songs</span>,
                type:SnackbarTypes.ERROR
            })
            return Promise.reject('Could not fetch user suggested songs')
        }
    }
    const onNextClick = async() => {
        showLoader(null)
        try{
            initialiseClubSongs()
            await fetchUserSuggestedSongs()
            hideLoader()
            navigate(RoutesKeys.SELECT_SONGS)
        } catch (err){
            hideLoader()
            console.error(err)
            showSnackbar({
                children:<span>{typeof err === 'string' ? err : 'Something went wrong'}</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    return (
        <>
            <Header pageName='Select Club' />
            <div className='clubs-container container content'>
                <p className='page-header'>Choose your club</p>
                <SelectSearch options={options} placeholder="Choose your club" search={true} value={club?.clubId} closeOnSelect={true} onChange={handleChange} filterOptions={fuzzySearchWrapper} />
                <button disabled={!club} className='select-button' onClick={onNextClick}>Select</button>
            </div>
        </>
    )
}

export default SelectClub