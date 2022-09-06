import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import Club, { instanceOfClub } from '../../entities/club'
import { Error } from '../../entities/error'
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


const SelectClub = () => {
    const [clubs, setClubs] = useState<Club[]>([])
    const {showLoader,hideLoader, showSnackbar} = useCommonComponents()
    const navigate = useNavigate()
    const fetchClubs = async () => {
        showLoader(null)
        try{
            const clubsResponse: Club[] | null | Error = await NetworkService.get({url:API_ENDPOINTS.fetchClubs})
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
            console.error(err)
            showSnackbar({
                children:<span>Cound not fetch clubs</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const {club, setClub} = useClub()
    useEffect(() => {
        fetchClubs()
    },[])
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
    return (
        <>
            <Header pageName='Select Club' />
            <div className='clubs-container container'>
                <p className='page-header'>Choose your club</p>
                <SelectSearch options={options} placeholder="Choose your club" search={true} value={club?.clubId} closeOnSelect={true} onChange={handleChange} filterOptions={fuzzySearchWrapper} />
                <button disabled={!club} className='select-button' onClick={() => navigate(RoutesKeys.SELECT_SONGS)}>Select</button>
            </div>
        </>
    )
}

export default SelectClub