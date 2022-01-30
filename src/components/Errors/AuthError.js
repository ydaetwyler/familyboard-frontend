import React from 'react'
import { useCookies } from 'react-cookie'

const AuthError = () => {
    // cookies & setCookie must be defined even we won't use it - otherwise it's broken
    const [cookies, setCookie, removeCookie] = useCookies(['accessGranted'])

    const handleLogout = () => {
        removeCookie('accessGranted')
    } 

    return (
        <div className="h-[160vh] w-full backdrop-blur-md top-0 left-0 absolute z-50">
            <div className="h-auto max-w-[480px] w-[95%] mb-10 bg-gray-800/[.9] relative top-5 mx-auto rounded-md border-2 border-white/[.1] shadow-xl shadow-gray-900/[.6] py-12 px-9 before:(p-0, m-0, box-border) after:(p-0, m-0, box-border) font-['Mulish']">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mt-3" fill="none" viewBox="0 0 24 24" stroke="red">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-3 text-4xl font-medium text-white text-center">
                    Ups, your login has expired.
                </p>
                <button
                    className="mt-10 mb-9 w-full bg-white text-black py-3 text-xl font-semibold rounded-sm cursor-pointer"
                    onClick={handleLogout}
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default AuthError