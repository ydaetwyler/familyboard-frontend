import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import Toggle from 'react-toggle'

import AddEventItem from './AddEventItem'
import EventItemTeaser from './EventItemTeaser'

const GET_ACTIVITIES = gql`
    query GetFamily {
        getFamily {
           eventList {
               _id,
               activityDate,
               activityParticipantsList {
                   _id
               }
           }
        }
    }
`

const EVENT_ITEM_SUBSCRIPTION = gql`
    subscription EventItemCreated($_id: ID!) {
        eventItemCreated(_id: $_id) {
            eventList {
                _id,
            }
        }
    }
`

const ActivityList = ({ familyID }) => {
    const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_ACTIVITIES)
    const [initialEvents, setInitialEvents] = useState([])
    const [events, setEvents] = useState([])
    const [togglePast, setTogglePast] = useState(false)

    useEffect(() => {
        if (data) {
            setInitialEvents(data.getFamily.eventList)
        }
    }, [data])

    useEffect(() => {
        subscribeToMore({
            document: EVENT_ITEM_SUBSCRIPTION,
            variables: { _id: familyID },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                refetch()
                return prev
            }
        })
    }, [])

    const parseActivityDate = (date) => {
        const dateToChange = new Date(date)
        const plusOneDate = new Date(dateToChange.setDate(dateToChange.getDate() + 1))
        return plusOneDate.getTime()
    }

    useEffect(() => {
        togglePast
           ? setEvents(initialEvents.filter(item => parseActivityDate(item.activityDate) < new Date().getTime()))
           : setEvents(initialEvents.filter(item => parseActivityDate(item.activityDate) > new Date().getTime()))
    }, [togglePast])

    useEffect(() => {
        if (initialEvents) {
            togglePast
                ? setEvents(initialEvents.filter(item => parseActivityDate(item.activityDate) < new Date().getTime()))
                : setEvents(initialEvents.filter(item => parseActivityDate(item.activityDate) > new Date().getTime()))
        }
    }, [initialEvents])

    const toggleHistoryHandler = () => togglePast ? setTogglePast(false) : setTogglePast(true)

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return JSON.stringify(error, null, 2)

    return (
        <div className="mt-20 flex flex-row flex-wrap justify-evenly">
            <label className="mx-auto absolute top-20 flex items-center cursor-pointer mb-4">
                <Toggle 
                    onChange={toggleHistoryHandler} 
                    defaultChecked={false} 
                    id="toggle-history"
                />
                <span className="ml-3 text-white text-sm font-medium">Show past events</span>
            </label>
            {!togglePast ? <AddEventItem familyID={familyID} /> : null}
            {events.map((item) => {
                return <EventItemTeaser 
                            key={item._id}
                            eventId={item._id}
                            familyID={familyID} 
                        />
            })}
        </div>
    )
}

export default ActivityList