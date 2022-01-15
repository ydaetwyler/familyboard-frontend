import React from 'react'

const UpdateBadge = () => (
    <div className="bg-white/[.3] absolute top-0 right-0 flex flex-row rounded-tr-lg rounded-l-lg pl-3 items-center">
    <p className="ml-1 text-sm font-['Mulish'] text-gray-800">Updated</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="rgba(157, 0, 0, 0.8)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    </div>
)

export default UpdateBadge