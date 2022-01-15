import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import UpdateUser from './UpdateUser'

const GET_USER = gql`
    query GetUser {
        getUser {
            userName,
            avatarUrl,
            selectedBgValue,
            selectedBgLabel
        }
    }
`

const User = ({ setBg, bg }) => {
    const { loading, error, data } = useQuery(GET_USER)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        if (data) {
            if (data.getUser.selectedBgValue && data.getUser.selectedBgLabel) {
                const bgSaved = {
                    value: data.getUser.selectedBgValue,
                    label: data.getUser.selectedBgLabel
                }
                setBg(bgSaved)
            }
        }
    }, [data])

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return `Error -> ${error}`

    return (
        <div>
            <div className="group flex flex-col pr-8 items-center cursor-pointer" onClick={() => setClicked(true)}>
                <img src={data.getUser.avatarUrl} className="h-10 w-12 group-hover:animate-bounce" />
                <p className="-mt-1 text-center text-sm text-white font-medium font-['Mulish'] opacity-70 group-hover:opacity-100">
                    {data.getUser.userName}
                </p>
            </div>
            <UpdateUser 
                clicked={clicked}
                setClicked={setClicked}
                initialUser={data.getUser.userName} 
                initialAvatar={data.getUser.avatarUrl} 
                setBg={setBg}
                bg={bg}
            />
        </div>
    )
}

export default User