import React, { FormEventHandler, useState } from 'react'

const AddClubForm = ({cancel, handleClubAdd}:{cancel:() => void, handleClubAdd:(email:string, name:string) => void}) => {
    const [email, setEmail] = useState<string>('')
    const [clubName, setClubName] = useState<string>('')
    const handleSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        handleClubAdd(email, clubName)
    }
    return (
        <div className='add-club-form-container'>
            <form className='add-club-form' onSubmit={handleSubmit}>
                    <label className='label' htmlFor='email'>Club name</label>
                    <input type="text" placeholder='Club name' name="club-name" onChange={(e) => setClubName(e.target.value)} id="club-name" value={clubName} required />
                    <label className='label' htmlFor='email'>DJ Email</label>
                    <input type='email' placeholder='Email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className='cta-container'><button onClick={cancel} className='outlined'>Cancel</button><button type='submit'>Add</button></div>
                </form>
        </div>
    )
}

export default AddClubForm