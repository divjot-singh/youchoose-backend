import React, { useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Club, { instanceOfClub } from '../../entities/club'
import { useCommonComponents } from '../../providers/commonComponentsProvider'
import NetworkService from '../../services/networkService'
import { API_ENDPOINTS } from '../../utils/apiEndpoints'
import { SnackbarTypes } from '../snackbar'
import './index.scss'

const ClubItem = ({club, handleClubDelete, handleClubUpdate}:{club:Club | null, handleClubUpdate:(club:Club, clubId:string) => void, handleClubDelete:(clubId:string) => void}) => {
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(club?.email ?? '')
    const [name, setName] = useState<string>(club?.clubName ?? '')
    const {showPopup,hidePopup, showSnackbar, showLoader, hideLoader} = useCommonComponents()
    const handleUpdate = async () => {
        try{
            let data = await NetworkService.post({
                url:API_ENDPOINTS.updateClub,
                data:{
                    club:{
                        clubId:club?.clubId,
                        clubName:name,
                        email:email
                    },
                    oldEmail:club?.email
                }
            })
            if(instanceOfClub(data)){
                setIsEditable(false)
                handleClubUpdate(data, club?.clubId ?? '')
            } else{
                console.error(data)
                showSnackbar({
                    children:<span>Could not update club.</span>,
                    type:SnackbarTypes.ERROR
                })
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Could not update club.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const cancelEdit = () => {
        setEmail(club?.email ?? '')
        setName(club?.clubName ?? '')
        setIsEditable(false)
    }
    const getCtas = () => {
        if(isEditable){
            return (
                <div className='club-info-ctas'>
                    <button type='button' className='outlined' onClick={cancelEdit}>Cancel</button>
                    <button type='submit' className='primary' onClick={handleUpdate}>Update</button>
                </div>
            )
        }
        return null
    }
    const deleteClub = async () => {
        try{
            hidePopup()
            showLoader({
                text:'Deleting...',
                children:null
            })
            let data = await NetworkService.post({
                url:API_ENDPOINTS.deleteClub,
                data:{
                    clubId:club?.clubId,
                    email:club?.email
                }
            })
            hideLoader()
            if(data && data['error']){
                console.error(data)
                showSnackbar({
                    children:<span>Could not update club.</span>,
                    type:SnackbarTypes.ERROR
                })
            } else{
                hideLoader()
                showSnackbar({
                    children:<span>Club deleted successfully</span>,
                    type:SnackbarTypes.SUCCESS
                })
                handleClubDelete(club?.clubId ?? '')
            }
        } catch(err){
            console.error(err)
            showSnackbar({
                children:<span>Could not delete club.</span>,
                type:SnackbarTypes.ERROR
            })
        }
    }
    const getPopupContent = () => {
        return (
            <div className='deletion-content'>
                <p>Are you sure you want to delete the club?</p>
                <div className='ctas'>
                    <button type='button' className='outlined' onClick={hidePopup}>Cancel</button>
                    <button type='submit' className='primary' onClick={deleteClub}>Yes</button>
                </div>
            </div>
        )
    }
    const handleDelete = () => {
        showPopup({
            children:getPopupContent()
        })
    }
    if(!club) return null
    return (
        <div className='club-item'>
            <div className='club-info'>
                <div className='club-info-item'>
                    <label>Name:</label>
                    {isEditable ? <input type="text" required value={name} onChange={(e) => setName(e.target.value)} /> : <span className='club-info-value'>{name}</span>}
                </div>
                <div className='club-info-item'>
                    <label>Email:</label>
                    {isEditable ? <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /> : <span className='club-info-value'>{email}</span>}
                </div>
                {getCtas()}
            </div>
            {!isEditable && <div className='icons'>
                <span className='edit-icon icon' onClick={() => setIsEditable(true)}><FaEdit size={20} color="#19183c" /></span>
                <span className='delete-icon icon' onClick={handleDelete}><FaTrash size={20} color="#19183c" /></span>
            </div>}
        </div>
    )
}

export default ClubItem