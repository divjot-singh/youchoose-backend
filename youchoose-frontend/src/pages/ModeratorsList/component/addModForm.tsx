import React, { FormEventHandler, useState } from 'react'

const AddModForm = ({cancel, handleModbAdd}:{cancel:() => void, handleModbAdd:(email:string) => void}) => {
    const [email, setEmail] = useState<string>('')
    const handleSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        handleModbAdd(email)
    }
    return (
        <div className='add-mod-form-container'>
            <form className='add-club-form' onSubmit={handleSubmit}>
                   <label className='label' htmlFor='email'>Moderator Email</label>
                    <input type='email' placeholder='Email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className='cta-container'><button onClick={cancel} className='outlined'>Cancel</button><button type='submit'>Add</button></div>
                </form>
        </div>
    )
}

export default AddModForm