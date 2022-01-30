import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import Login from '../Login/Login'
import Family from '../Family/Family'
import User from '../User/User'
import ActivityList from '../Activity/ActivityList'

import CheckError from '../Errors/CheckError'

import { SELECT_BG } from '../../utils/mutations'

const GET_FAMILY = gql`
    query GetFamily {
        getFamily {
            _id
        }
    }
`

const Dashboard = () => {
    const { loading, error, data } = useQuery(GET_FAMILY)
    // setCookie must be defined even we won't use it - otherwise it's broken
    const [access, setAccess] = useState()
    const [bgSelection, setBgSelection] = useState(null)
    const [selectBg, { loading: setBgLoading, error: setBgError }] = useMutation(SELECT_BG)

    // value & label saved seperatly to use in select
    useEffect(() => {
        if (bgSelection) {
            if (bgSelection.value && bgSelection.label) {
                selectBg({
                    variables: {
                        selectedBgValue: bgSelection.value,
                        selectedBgLabel: bgSelection.label
                    }
                })
            }
        }
    }, [bgSelection])

    if (localStorage.getItem('accessGranted') != 'yes') return <Login />

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return <CheckError error={error} />
    if (setBgError) return <CheckError error={setBgError} />

    // Otherwise hash (new family first login, join family or pw reset) stays present
    window.history.replaceState(null, "Dashboard", "/")

    const handleLogout = () => {
        localStorage.removeItem('accessGranted')
        window.location.reload()
    } 

    return (
        <div className={(bgSelection ? bgSelection.value : 'bg-clouds') + " w-full min-h-screen sm:h-[160vh] h-[200vh] overflow-x-hidden overflow-y-auto"}>
            <div className="pt-2 pl-2 fixed flex flex-row w-full justify-between z-50 pb-1 bg-white/[.1]">
                <h1 className="text-2xl lg:text-4xl font-bold text-white font font-['Righteous']">Family Board</h1>
                <div className="flex flex-row justify-between pr-5">
                    <User setBg={setBgSelection} bg={bgSelection} />
                    <Family familyID={data.getFamily ? data.getFamily._id : null} />
                    <img 
                        src="/icons/logout.png" 
                        className="h-9 w-9 ml-3 cursor-pointer opacity-60 hover:opacity-100" 
                        onClick={handleLogout}
                    />
                </div>
            </div>
            <ActivityList familyID={data.getFamily ? data.getFamily._id : null} />
        </div>
    )
}

export default Dashboard