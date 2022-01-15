import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { gql, useQuery, useMutation } from '@apollo/client'

import Gallery from './Gallery'

import { stringToDate } from '../../utils/dateHelpers.js'
import TextInput from '../Forms/Utils/TextInput'
import TextArea from '../Forms/Utils/TextArea'
import { validateEvent } from '../Forms/Utils/validations'

import { CREATE_EVENT_ITEM } from '../../utils/mutations'

const CreateEventItem = ({ clicked, setClicked, familyID }) => {
    const [fail, setFail] = useState()
    const [galleryClicked, setGalleryClicked] = useState(false)
    const [imgUrl, setImgUrl] = useState('/activities/image38.jpg')
    const [createEventItem, { loading, error }] = useMutation(CREATE_EVENT_ITEM, {
        onCompleted: () => setClicked(false),
        onError: () => setFail(true)
    })

    if (!clicked) return null

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return JSON.stringify(error ? error : null, 2)

    return (
        <div>
            <div className="h-[140vh] w-full backdrop-blur-md top-0 left-0 absolute z-50">
                <div className="h-auto max-w-[480px] w-[95%] mb-10 bg-gray-800/[.9] relative top-5 mx-auto rounded-md border-2 border-white/[.1] shadow-xl shadow-gray-900/[.6] py-12 px-9 before:(p-0, m-0, box-border) after:(p-0, m-0, box-border) font-['Mulish']">
                    <img 
                        src="/icons/close.png" 
                        className="absolute top-1.5 right-1.5 h-6 w-6 opacity-30 hover:opacity-100 cursor-pointer"
                        onClick={() => setClicked(false)}
                    />
                    <img 
                        className="-mt-7 mb-5 rounded-lg w-80 h-60 mx-auto cursor-pointer" 
                        src={imgUrl} 
                        onClick={() => setGalleryClicked(true)}
                    />
                    <Formik
                        initialValues={{ 
                            activityName: '',
                            activityDate: '',
                            activityLocation: '',
                            activityAddress: '',
                            activityDescription: '',
                            activityUrl: '',
                        }}
                        validationSchema={validateEvent}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                createEventItem({ 
                                    variables: { 
                                        familyID: familyID,
                                        activityImageUrl: imgUrl,
                                        activityName: values.activityName,
                                        activityDescription: values.activityDescription,
                                        activityDate: stringToDate(values.activityDate),
                                        activityLocation: values.activityLocation,
                                        activityAddress: values.activityAddress,
                                        activityUrl: values.activityUrl,
                                    } 
                                })
                                setSubmitting(false)
                            }, 400)
                        }}
                    >
                        <Form>
                            <TextInput
                                className="mb-7 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-4xl font-medium text-white text-center"
                                id="activityName"
                                label="Activity name"
                                name="activityName"
                                type="text"
                                placeholder=""
                            />
                            <TextArea
                                className="mb-6 block w-full bg-white/[.07] rounded-sm px-2 mt-2 text-base font-medium text-white"
                                id="activityDescription"
                                label="Activty description"
                                name="activityDescription"
                                rows="4"
                                placeholder=""
                            />
                            <TextInput
                                className="mb-6 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-xl font-medium text-white"
                                id="activityDate"
                                label="Date"
                                name="activityDate"
                                type="text"
                                placeholder=""
                            />
                            <TextInput
                                className="mb-3 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-xl font-medium text-white"
                                id="activityLocation"
                                label="City"
                                name="activityLocation"
                                type="text"
                                placeholder=""
                            />
                            <TextInput
                                className="mb-6 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-xl font-medium text-white"
                                id="activityAddress"
                                label="Address"
                                name="activityAddress"
                                type="text"
                                placeholder=""
                            />
                            <TextInput
                                className="mb-6 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-xl font-medium text-white"
                                id="activityUrl"
                                label="Url"
                                name="activityUrl"
                                type="text"
                                placeholder=""
                            />
                            <button
                                className="mt-3 mb-9 w-full bg-white text-black py-3 text-xl font-semibold rounded-sm cursor-pointer" 
                                disabled={loading} 
                                type="submit"
                            >
                            Create event
                            </button>
                            {error && <p>{error.message}</p>}
                        </Form>
                    </Formik>
                </div>
            </div>
            <Gallery
                galleryClicked={galleryClicked}
                setGalleryClicked={setGalleryClicked}
                setImgUrl={setImgUrl}
                imgUrl={imgUrl}
            />
        </div>
    )
}

export default CreateEventItem