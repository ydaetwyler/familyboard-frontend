import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { gql, useQuery, useMutation } from '@apollo/client'
import Login from '../Login/Login'
import Family from '../Family/Family'
import User from '../User/User'
import ActivityList from '../Activity/ActivityList'

import AuthError from '../Errors/AuthError'
import ForbiddenError from '../Errors/ForbiddenError'

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
    const [cookies, setCookie, removeCookie] = useCookies(['userToken'])
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

    if (!cookies.userToken) return <Login />

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error.errors || setBgError.errors) {
        if (
            error.errors[0].extensions.code == 'UNAUTHENTICATED'
            ||
            setBgError.errors[0].extensions.code == 'UNAUTHENTICATED'
        ) {
            return <AuthError />
        }
        if (
            error.errors[0].extensions.code == 'FORBIDDEN'
            ||
            setBgError.errors[0].extensions.code == 'FORBIDDEN'
        ) {
            return <ForbiddenError />
        }
    }

    // Otherwise hash (new family first login, join family or pw reset) stays present
    window.history.replaceState(null, "Dashboard", "/")

    const handleLogout = () => {
        removeCookie('userToken')
    } 

    return (
        <div className={(bgSelection ? bgSelection.value : 'bg-clouds') + " w-full min-h-screen sm:h-[160vh] h-[200vh] overflow-x-hidden overflow-y-auto"}>
            <div className="pt-2 pl-2 flex flex-row w-full justify-between">
                <h1 className="text-2xl lg:text-4xl font-bold text-white font font-['Righteous']">Family Board</h1>
                <div className="flex flex-row justify-between pr-5">
                    <User setBg={setBgSelection} bg={bgSelection} />
                    <Family familyID={data.getFamily._id} />
                    <img 
                        src="/icons/logout.png" 
                        className="h-9 w-9 ml-3 cursor-pointer opacity-60 hover:opacity-100" 
                        onClick={handleLogout}
                    />
                </div>
            </div>
            <ActivityList familyID={data.getFamily._id} />
        </div>
    )
}

export default Dashboard