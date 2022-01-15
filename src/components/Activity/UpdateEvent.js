import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import { gql, useQuery, useMutation } from '@apollo/client'
import Toggle from 'react-toggle'
import '../Forms/Utils/toggle.css'

import { getShortDate, stringToDate } from '../../utils/dateHelpers.js'

import Gallery from './Gallery'
import EventComments from './EventComments'
import WeatherForecast from './WeatherForecast'
import AddEventComment from './AddEventComment'

import TextInput from '../Forms/Utils/TextInput'
import TextArea from '../Forms/Utils/TextArea'
import { validateEvent } from '../Forms/Utils/validations'

import { 
    REMOVE_PARTICIPANT,
    ADD_PARTICIPANT,
    CHECK_USER_PARTICIPANT,
    UPDATE_EVENT_ITEM,
    REMOVE_NOTIFICATIONS
 } from '../../utils/mutations'

const GET_EVENT_PARTICIPANTS = gql`
    query GetEventParticipants($_id: ID!) {
        getEventParticipants(_id: $_id) {
            activityParticipantsList {
                userName,
                avatarUrl
            }
        }
    }
`

const PARTICIPANTS_SUBSCRIPTION = gql`
    subscription EventParticipantsChanged($_id: ID!) {
        eventParticipantsChanged(_id: $_id) {
            activityParticipantsList {
                userName,
                avatarUrl
            }
        }
    }
`

const GET_EVENT_COMMENTS = gql`
    query GetEventComments($_id: ID!) {
        getEventComments(_id: $_id) {
            comments {
                _id
            }
        }
    }
`

const EVENT_COMMENT_SUBSCRIPTION = gql`
    subscription EventCommentsChanged($_id: ID!) {
        eventCommentsChanged(_id: $_id) {
            comments {
                _id
            }
        }
    }
`

const UpdateEvent = ({ clicked, setClicked, id, item, weather, refetchEvents }) => {
    const [removeParticipant] = useMutation(REMOVE_PARTICIPANT, {
        onCompleted: () => refetchEvents,
        onError: () => setFail(true)
    })
    const [addParticipant] = useMutation(ADD_PARTICIPANT, {
        onCompleted: () => refetchEvents,
        onError: () => setFail(true)
    })
    const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_EVENT_PARTICIPANTS, {
        variables: { _id: id }
    })
    const { loading: getEventCommentsLoading, error: getEventCommentsError, data: getEventCommentsData, refetch: getEventCommentsRefetch, subscribeToMore: getEventCommentsSubscribeToMore } = useQuery(GET_EVENT_COMMENTS, {
        variables: { _id: id }
    })
    const [galleryClicked, setGalleryClicked] = useState(false)
    const [imgUrl, setImgUrl] = useState(item.activityImageUrl)
    const [participants, setParticipants] = useState([])
    const [fail, setFail] = useState(false)
    const [joined, setJoined] = useState()
    const [checkUserParticipant] = useMutation(CHECK_USER_PARTICIPANT, {
        onError: () => setFail(true),
        onCompleted: data => setJoined(data.checkUserParticipant)
    })
    const [updateEventItem, { loading: loadingUpdateEvent, error: errorUpdateEvent }] = useMutation(UPDATE_EVENT_ITEM, {
        onCompleted: () => setClicked(false),
        onError: () => setFail(true)
    })
    const [removeNotifications] = useMutation(REMOVE_NOTIFICATIONS, {
        onCompleted: () => refetchEvents
    })

    useEffect(() => {
        if (data) {
            setParticipants(data.getEventParticipants.activityParticipantsList)
        }
    }, [data])

    useEffect(() => {
        checkUserParticipant({ 
            variables: { 
                _id: id
            } 
        })
    }, [])

    useEffect(() => {
        subscribeToMore({
            document: PARTICIPANTS_SUBSCRIPTION,
            variables: { _id: id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                
                refetch()
                return prev
            }
        })
    }, [])

    useEffect(() => {
        getEventCommentsSubscribeToMore({
            document: EVENT_COMMENT_SUBSCRIPTION,
            variables: { _id: id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                
                getEventCommentsRefetch()

                return prev
            }
        })
    }, [])

    useEffect(() => {
        const handleEsc = event => {
            if (event.keyCode === 27) {
                if (galleryClicked) {
                    setGalleryClicked(false)
                    setClicked(true)
                } else {
                    setClicked(false)
                }
            }
        }
        window.addEventListener('keydown', handleEsc)
    })

    const handleJoinChange = () => {
        if (joined) {
            removeParticipant({ 
                variables: { 
                    _id: id,
                } 
            })
            setJoined(false)
        } else {
            addParticipant({ 
                variables: { 
                    _id: id,
                } 
            })
            setJoined(true)
        }
    }
    
    if (!clicked) return null
    if (clicked) removeNotifications({
        variables: {
            eventId: id
        }
    })

    if (loading || loadingUpdateEvent) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error || errorUpdateEvent) return JSON.stringify(error ? error : errorUpdateEvent, null, 2)

    return (
        <div>
            <div className="h-[160vh] w-full backdrop-blur-md top-0 left-0 absolute z-50">
                <div className="h-auto max-w-[480px] w-[95%] mb-10 bg-gray-800/[.9] relative top-5 mx-auto rounded-md border-2 border-white/[.1] shadow-xl shadow-gray-900/[.6] py-12 px-9 before:(p-0, m-0, box-border) after:(p-0, m-0, box-border) font-['Mulish']">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute top-1.5 right-1.5 opacity-30 hover:opacity-100 cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={() => setClicked(false)}>
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <img 
                        className="-mt-7 mb-5 rounded-lg w-80 h-60 mx-auto cursor-pointer" 
                        src={imgUrl} 
                        onClick={() => setGalleryClicked(true)}
                    />
                    <Formik
                        initialValues={{ 
                            activityName: item.activityName,
                            activityDate: getShortDate(item.activityDate),
                            activityLocation: item.activityLocation,
                            activityAddress: item.activityAddress,
                            activityDescription: item.activityDescription,
                            activityUrl: item.activityUrl,
                        }}
                        validationSchema={validateEvent}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                updateEventItem({ variables: { 
                                    _id: id,
                                    activityImageUrl: imgUrl,
                                    activityName: values.activityName,
                                    activityDescription: values.activityDescription,
                                    activityDate: stringToDate(values.activityDate),
                                    activityLocation: values.activityLocation,
                                    activityAddress: values.activityAddress,
                                    activityUrl: values.activityUrl,
                                    } })
                                setSubmitting(false)
                            }, 400)
                        }}
                    >
                        <Form>
                            <TextInput
                                className="mb-7 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-4xl font-medium text-white text-center"
                                id="activityName"
                                name="activityName"
                                type="text"
                                placeholder=""
                            />
                            <TextArea
                                className="mb-6 block w-full bg-white/[.07] rounded-sm px-2 mt-2 text-base font-medium text-white"
                                id="activityDescription"
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
                            <div>
                                <TextInput
                                    className="mb-6 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-xl font-medium text-white"
                                    id="activityAddress"
                                    label="Address"
                                    name="activityAddress"
                                    type="text"
                                    placeholder=""
                                />
                                <a 
                                    href={`https://www.google.ch/maps/place/${item.activityAddress},+${item.activityLocation}`} 
                                    target="_blank"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 absolute -mt-20 pt-2 right-10 opacity-70 hover:opacity-100 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="url(#GradientMaps)">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <defs>
                                            <linearGradient id="GradientMaps" x2="100%" y2="55%">
                                                <stop offset="30%" stop-color="#fc2c03" />
                                                <stop offset="0%" stop-color="#1303fc" />
                                                <stop offset="90%" stop-color="#1a9900" />
                                                <stop offset="100%" stop-color="#c9bf00" />
                                            </linearGradient>
                                        </defs> 
                                    </svg>
                                </a>
                            </div>
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
                                disabled={loading || loadingUpdateEvent} 
                                type="submit"
                            >
                            Update event
                            </button>
                            {errorUpdateEvent && <p>{errorUpdateEvent.message}</p>}
                        </Form>
                    </Formik>
                    <label className="absolute right-5 flex items-center cursor-pointer mb-4">
                        <Toggle 
                            onChange={handleJoinChange} 
                            defaultChecked={joined} 
                            id="toggle-participate"
                        />
                        <span className="ml-3 text-white text-sm font-medium">Join activity</span>
                    </label>
                    <h4 className="block text-xl font-medium text-gray-300">Participants</h4>
                    <div className="flex flex-row overflow-x-scroll mt-3 mb-9">
                        <div className="flex flex-col items-center">
                            {participants ? participants.map((member) => 
                                <p key={member.userName} className="text-white">{member.userName}</p>
                            ) : null}
                            {participants ? participants.map((member) =>
                                <img key={member.userName} className="h-12 w-12" src={member.avatarUrl} />
                            ) : null}
                        </div>
                    </div>
                    <WeatherForecast weather={weather} />
                    <h4 className="block mt-9 text-xl font-medium text-gray-300">Comments</h4>
                    <AddEventComment id={id} />
                    {getEventCommentsData ? getEventCommentsData.getEventComments.comments.map(comment => 
                        <EventComments key={comment._id} id={comment._id} eventId={id} />
                    ) : null}
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

export default UpdateEvent