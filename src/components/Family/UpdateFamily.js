import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'

import Invite from './Invite'
import UserOverview from '../User/UserOverview'

import CheckError from '../Errors/CheckError'

import TextInput from '../Forms/Utils/TextInput'
import { UPDATE_FAMILY } from '../../utils/mutations'
import { validateNewFamily} from '../Forms/Utils/validations'

const UpdateFamily = ({ familyID, clicked, setClicked, initialFamily, initialAvatar, familyMembers }) => {
    const [emojis, setEmojis] = useState([])
    const [selectEmoji, setSelectEmoji] = useState(initialAvatar)
    
    const [updateFamily, { loading, error }] = useMutation(UPDATE_FAMILY, {
        onCompleted: () => setClicked(false)
    })

    const getEmojis = () => {
        const arr = []
        
        for (let i = 1; i <= 117; i++) {
            arr.push(`/openmoji/emoji${i}.png`)
        }

        return arr
    }

    useEffect(() => {
        setEmojis(getEmojis())
    }, [])

    useEffect(() => {
        const handleEsc = event => {
            if (event.keyCode === 27) {
                setClicked(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
    })

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    
    if (error) return <CheckError error={error} />

    if (!clicked) return null

    return (
        <div className="h-3/5 min-h-[960px] max-w-[480px] w-[95%] min-w-[300px] bg-white/[.13] absolute translate-x-2/4 top-32 mt-24 right-2/4 rounded-md backdrop-blur-md border-2 border-white/[.1] shadow-xl shadow-gray-900/[.6] py-12 px-9 before:(p-0, m-0, box-border) after:(p-0, m-0, box-border) font-['Mulish'] z-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute top-1.5 right-1.5 opacity-30 hover:opacity-100 cursor-pointer" viewBox="0 0 20 20" fill="rgba(198, 198, 198, 0.8)" onClick={() => setClicked(false)}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h3 className="mb-2 text-center text-4xl text-white font-medium leading-9">
                Members
            </h3>
            <div className="flex flex-row flex-wrap overflow-x-scroll mt-2">
                {familyMembers.map((member) => {
                    if (member.active) {
                        return <UserOverview 
                            key={member.userName} userName={member.userName} avatarUrl={member.avatarUrl} 
                        />
                    }
                })}
            </div>
            <h3 className="mt-8 mb-2 text-center text-4xl text-white font-medium leading-9">
                Change family
            </h3>
            <Formik
                initialValues={{ familyName: initialFamily }}
                validationSchema={validateNewFamily}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        updateFamily({ variables: { 
                            _id: familyID,
                            familyName: values.familyName,
                            familyAvatarUrl: selectEmoji
                            } })
                        setSubmitting(false)
                    }, 400)
                }}
            >
                <Form>
                    <TextInput
                        className="mb-3 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-xl font-medium text-white"
                        id="familyName"
                        label="Name"
                        name="familyName"
                        type="text"
                        placeholder=""
                    />
                    <div className="flex flex-row overflow-x-scroll mt-6">
                        {emojis.map((emoji) => 
                            <img key={emoji} className={`h-12 w-12 mb-4 cursor-pointer ${(emoji === selectEmoji) ? "bg-blue-200/[.5]" : "bg-none"}`} src={emoji} onClick={() => setSelectEmoji(emoji)} />
                        )}
                    </div>
                    <button
                        className="mt-6 w-full bg-white text-black py-3 text-xl font-semibold rounded-sm cursor-pointer" 
                        disabled={loading} 
                        type="submit"
                    >
                        Save
                    </button>
                    {error && <p>{error.message}</p>}
                </Form>
            </Formik>
            <Invite familyID={familyID} />
        </div>
)
}

export default UpdateFamily