import React, { useState } from 'react'

import CreateEventItem from './CreateEventItem'

const AddEventItem = ({ familyID }) => {
    const [clicked, setClicked] = useState(false)

    return (
        <>
            <div className="mb-16 relative flex items-center justify-center shadow-md border rounded-lg max-w-xs w-full bg-white/[.1] border-white/[.3] mx-8 font-['Mulish'] cursor-pointer hover:bg-white/[.2]" onClick={() => setClicked(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="rgba(255, 255, 255, 0.7)">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </div>
            <CreateEventItem clicked={clicked} setClicked={setClicked} familyID={familyID} />
        </>
    )
}

export default AddEventItem