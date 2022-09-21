import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'
import ClubItem from '../../components/clubItem'
import FloatingActionButton, { FabPosition } from '../../components/floating_action_button'
import Header from '../../components/header'
import { SnackbarTypes } from '../../components/snackbar'
import Club from '../../entities/club'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import { useAuth } from '../../providers/userProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import AddModForm from './component/addModForm'
import ModTile from './component/modTile'
import './index.scss'

const ModeratorsList = () => {
    const { user } =useAuth()
    const {showLoader,hideLoader, showSnackbar, showPopup, hidePopup} = useCommonComponents()
    const navigate = useNavigate()
    const [mods, setMods] = useState<string[]>([])
    const [filteredMods, setFilteredMods] = useState<(string | null)[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const debouncedValue = useDebounce<string>(searchQuery, 200)
    let isFetchingMods = false
    const handleDelete = async (email:string) => {
        try{
            showLoader({
                children:null,
                text:'Deleting...'
            })
            let data = await NetworkService.post({
                url:API_ENDPOINTS.deleteMod,
                data:{
                    email
                }
            })
            hideLoader()
            if(data && data['error']){
                console.error(data)
                showSnackbar({
                    children:<span>Cound not delete moderator</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                hidePopup()
                setMods(mods.filter((mod) => mod !== email))
                showSnackbar({
                    children:<span>Moderator deleted successfully</span>,
                    type:SnackbarTypes.SUCCESS
                })
            }
        } catch(err){
            console.error(err)
            hideLoader()
            showSnackbar({
                children:<span>Cound not delete moderator</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const fetchMods = async() => {
        if(isFetchingMods) return
        isFetchingMods = true
        try{
            let mods = await NetworkService.get({
                url:API_ENDPOINTS.getModerators
            })
            hideLoader()
            if(Array.isArray(mods)){
                setMods(mods)
            } else{
                console.error(mods)
                showSnackbar({
                    children:<span>Cound not fetch moderators</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            console.error(err)
            hideLoader()
            showSnackbar({
                children:<span>Cound not fetch moderators</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    useEffect(() => {
        fetchMods()
    },[])
    const filterMods= ()=>{
        let modsFiltered = mods.filter((mod:string) => mod.indexOf(debouncedValue) > -1)
        setFilteredMods(modsFiltered)
    }
    useEffect(() => {
        if(debouncedValue){
            filterMods()
        } else{
            setFilteredMods(mods)
        }
    },[debouncedValue, mods])
    const handleAdd = async (email:string) => {
        try{
            showLoader({
                children:null,
                text:'Adding...'
            })
            let data = await NetworkService.post({
                url:API_ENDPOINTS.addModerator,
                data:{
                    email
                }
            })
            hideLoader()
            if(data && data['error']){
                console.error(data)
                showSnackbar({
                    children:<span>Cound not add moderator</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                hidePopup()
                setMods([...mods, email])
                showSnackbar({
                    children:<span>Moderator successfully added</span>,
                    type:SnackbarTypes.SUCCESS
                })
            }
        } catch(err){
            console.error(err)
            hideLoader()
            showSnackbar({
                children:<span>Cound not add moderator</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const addMod = () => {
        showPopup({
            children:<AddModForm cancel={hidePopup} handleModbAdd={handleAdd} />
        })
    }
    
    return (
        <>
            <Header pageName='Moderators list' />
            <div className='clubs-container mods-container container content'>
                <input type="text" placeholder='Search club' value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
                <div className='clubs-list'>
                    {filteredMods.length ? filteredMods.map((mod:string | null, index:number) => <ModTile key={mod} email={mod || ''} onDelete={handleDelete} isMe={user?.email === mod}/>) : <p className='empty-state'>No mods found</p>}
                </div>
                <FloatingActionButton onClick={addMod} isRound={true} position={FabPosition.right}><FaPlus color='white' size={32} /></FloatingActionButton>

            </div>
        </>
    )
}

export default ModeratorsList