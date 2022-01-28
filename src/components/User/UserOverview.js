import React from 'react'

const UserOverview = ({ userName, avatarUrl }) => (
    <div className="flex flex-col items-center pr-3">
        <p className="text-white">{userName}</p>
        <img className="h-12 w-12" src={avatarUrl} />
    </div>
)

export default UserOverview