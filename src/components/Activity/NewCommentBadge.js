import React from 'react'

const NewCommentBadge = () => (
    <div className="bg-white/[.3] absolute top-12 right-0 flex flex-row rounded-l-lg pl-2 items-center">
        <p className="mr-1 text-sm font-['Mulish'] text-gray-800">unread</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgba(0, 0, 0, 0.85)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    </div>
)

export default NewCommentBadge