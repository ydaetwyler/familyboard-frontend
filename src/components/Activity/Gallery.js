import React, { useState, useEffect } from 'react'

const Gallery = ({ galleryClicked, setGalleryClicked, setImgUrl, imgUrl }) => {
    const [activityImg, setActivityImg] = useState([])

    const getActivityImg = () => {
        const arr = []
        
        for (let i = 1; i <= 38; i++) {
            arr.push(`/activities/image${i}.jpg`)
        }

        return arr
    }

    useEffect(() => {
        setActivityImg(getActivityImg())
    }, [])

    if (!galleryClicked) return null

    return (
        <div className="h-auto w-full absolute top-0 left-0 bg-gray-600 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute top-1.5 right-1.5 opacity-30 hover:opacity-100 cursor-pointer" viewBox="0 0 20 20" fill="rgba(198, 198, 198, 0.8)" onClick={() => setGalleryClicked(false)}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <div className="flex flex-row flex-wrap mt-10 justify-around">
                {activityImg.map((img) => 
                    <img key={img} className={`h-40 w-60 mb-8 mx-4 cursor-pointer ${(img === imgUrl) ? "border-yellow-200 border-4" : "border-none"}`} src={img} onClick={() => {
                            setImgUrl(img)
                            setGalleryClicked(false)
                        }
                    } />
                )}
            </div>
        </div>
    )
}

export default Gallery