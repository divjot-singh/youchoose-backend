import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import { SnackbarTypes } from '../../components/snackbar'
import Club, { instanceOfClub } from '../../entities/club'
import { UserType } from '../../entities/user'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import { useAuth } from '../../providers/userProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import { RoutesKeys } from '../../utils/routes'
import { Error as AppError } from '../../entities/error'
import { useClub } from '../../providers/clubProvider'
import { SelectSearchOption } from 'react-select-search'
import fuzzySearch from '../../utils/fuzzySearch'
import ClubItem from '../../components/clubItem'
import { useDebounce } from 'usehooks-ts'
import './index.scss'
import FloatingActionButton, {FabPosition} from '../../components/floating_action_button'
import { FaPlus } from 'react-icons/fa'
import AddClubForm from './components/addClubForm'


const ClubsList = () => {
    const { user } =useAuth()
    const {showLoader,hideLoader, showSnackbar, showPopup, hidePopup} = useCommonComponents()
    const navigate = useNavigate()
    const [clubs, setClubs] = useState<Club[]>([])
    const [filteredClubs, setFilteredClubs] = useState<(Club | null)[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const debouncedValue = useDebounce<string>(searchQuery, 200)
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
    useEffect(() => {
        fetchClubs()
    },[])
    useEffect(() => {
        if(!user || user.user_type !== UserType.MODERATOR){
            navigate(RoutesKeys.SELECT_CLUB)
        }
    },[user])
    const filterClubsWithQuery = () => {
        const options:SelectSearchOption[] = clubs.map((club:Club) => {
            return {
                name:club.clubName,
                value:club.clubId
            }
        })
        let filteredOptions:SelectSearchOption[] = fuzzySearch(options, debouncedValue)
        let filteredOptionClubs:(Club | null)[] = filteredOptions.map((filteredOption:SelectSearchOption) => {
            const clubItem:Club | undefined = clubs.find((club:Club) => club.clubId === filteredOption.value.toString()) 
            if(!clubItem) return null
            return clubItem
        })
        setFilteredClubs(filteredOptionClubs)
    }
    useEffect(() => {
        if(debouncedValue.length){
            filterClubsWithQuery()
        } else{
            setFilteredClubs(clubs)
        }
    },[debouncedValue])
    const handleClubDelete = (clubId:string) => {
        let nonDeletedClubs = clubs.filter((club:Club) => club.clubId !== clubId)
        setClubs(nonDeletedClubs)
    }
    const handleClubUpdate =(updatedClub:Club, clubId:string) => {
        let nonUpdatedClubs = clubs.map((club:Club) => {
            if(club.clubId === clubId) return updatedClub
            return club
        })
        setClubs(nonUpdatedClubs)
    }
    const handleClubAdd = async (email:string, name:string) => {
        try{
            showLoader(null)
            const data = await NetworkService.post({
                url:API_ENDPOINTS.addClub,
                data:{
                    clubName:name,
                    email:email
                }
            })
            hideLoader()
            if(data && data['error']){
                showSnackbar({
                    children:<span>Cound not add clubs</span>,
                    type:SnackbarTypes.ERROR
                })
            } else if(instanceOfClub(data)){
                setClubs([...clubs, data])
                hidePopup()
                showSnackbar({
                    children:<span>Club successfully added</span>,
                    type:SnackbarTypes.SUCCESS
                })
            }
        } catch(err){
            hideLoader()
            console.error(err)
            showSnackbar({
                children:<span>Cound not add clubs</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const addClub = () => {
       showPopup({
        children:<AddClubForm handleClubAdd={handleClubAdd} cancel={hidePopup} />
       })
    }
    useEffect(() => {
        if(debouncedValue.length){
            filterClubsWithQuery()
        } else{
            setFilteredClubs(clubs)
        }
    },[clubs])
    return (
        <>
            <Header pageName='Clubs list' />
            <div className='clubs-container container content'>
                <input type="text" placeholder='Search club' value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
                <div className='clubs-list'>
                    {filteredClubs.length ? filteredClubs.map((club:Club | null, index:number) => <ClubItem key={club?.clubId} club={club} handleClubUpdate={handleClubUpdate} handleClubDelete={handleClubDelete}/>) : <p className='empty-state'>No clubs found</p>}
                </div>
                <FloatingActionButton onClick={addClub} isRound={true} position={FabPosition.right}><FaPlus color='white' size={32} /></FloatingActionButton>
                {/* <SelectSearch options={options} placeholder="Choose your club" search={true} value={club?.clubId} closeOnSelect={true} onChange={handleChange} filterOptions={fuzzySearchWrapper} />
                <button disabled={!club} className='select-button' onClick={onNextClick}>Select</button> */}
            </div>
        </>
    )
}

export default ClubsList