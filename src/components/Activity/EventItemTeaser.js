import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { getDate } from '../../utils/dateHelpers'
import Weather from './Weather'
import axios from 'axios'

import { SET_COORDINATES } from '../../utils/mutations'

import UpdateEvent from './UpdateEvent'
import JoinedBadge from './JoinedBadge'
import UpdateBadge from './UpdateBadge'
import NewCommentBadge from './NewCommentBadge'

const GET_EVENT_ITEM = gql`
    query GetEventItem($_id: ID!) {
        getEventItem(_id: $_id) {
            activityName,
            activityImageUrl,
            activityDate,
            activityDescription,
            activityLocation,
            activityAddress,
            activityUrl,
            userJoined,
            updated,
            newComment
        }
    }
`

const EVENT_ITEM_SUBSCRIPTION = gql`
    subscription EventItemChanged($_id: ID!) {
        eventItemChanged(_id: $_id) {
            activityName,
            activityImageUrl,
            activityDate,
            activityDescription,
            activityLocation,
            activityAddress,
            activityUrl,
        }
    }
`

const GET_WEATHER = gql`
    query GetWeather($_id: ID!) {
        getWeather(_id: $_id) {
            activityApiLastCall,
            activityWeatherIcon,
            activityWeatherTemp,
            activityWeatherDesc,
            activityWeatherSunrise,
            activityWeatherSunset,
            activityWeatherWind,
        }
    }
`

const WEATHER_SUBSCRIPTION = gql`
    subscription WeatherChanged($_id: ID!) {
        weatherChanged(_id: $_id) {
            activityApiLastCall,
            activityWeatherIcon,
            activityWeatherTemp,
            activityWeatherDesc,
            activityWeatherSunrise,
            activityWeatherSunset,
            activityWeatherWind,
        }
    }
`

const GET_COORDINATES = gql`
    query GetCoordinates($_id: ID!) {
        getCoordinates(_id: $_id) {
            activityCoordinates,
            activityApiCityNotFound,
        }
    }
`

const COORDINATES_SUBSCRIPTION = gql`
    subscription CoordinatesChanged($_id: ID!) {
        coordinatesChanged(_id: $_id) {
            activityCoordinates,
            activityApiCityNotFound,
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

const EventItemTeaser = ({ eventId }) => {
    const [dateDiff, setDateDiff] = useState()
    const [currentDate] = useState(new Date())
    const [clicked, setClicked] = useState(false)
    const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_EVENT_ITEM, {
        variables: { _id: eventId }
    })
    const { loading: getWeatherLoading, error: getWeatherError, data: getWeatherData, refetch: getWeatherRefetch, subscribeToMore: getWeatherSubscribeToMore } = useQuery(GET_WEATHER, {
        variables: { _id: eventId }
    })
    const { loading: getCoordinatesLoading, error: getCoordinatesError, data: getCoordinatesData, refetch: getCoordinatesRefetch, subscribeToMore: getCoordinatesSubscribeToMore } = useQuery(GET_COORDINATES, {
        variables: { _id: eventId }
    })
    const [setCoordinates] = useMutation(SET_COORDINATES)

    useEffect(() => {
        subscribeToMore({
            document: EVENT_ITEM_SUBSCRIPTION,
            variables: { _id: eventId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newEventItem = subscriptionData.data.eventItemChanged

                return {
                    getEventItem: {...prev.getEventItem, ...newEventItem}
                }
            }
        })
    }, [])

    useEffect(() => {
        getWeatherSubscribeToMore({
            document: WEATHER_SUBSCRIPTION,
            variables: { _id: eventId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                getWeatherRefetch()
                return prev
            }
        })
    }, [])

    useEffect(() => {
        getCoordinatesSubscribeToMore({
            document: COORDINATES_SUBSCRIPTION,
            variables: { _id: eventId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                
                getCoordinatesRefetch()
                return prev
            }
        })
    }, [])

    useEffect(() => {
        subscribeToMore({
            document: EVENT_COMMENT_SUBSCRIPTION,
            variables: { _id: eventId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                
                refetch()

                return prev
            }
        })
    }, [])

    useEffect(() => {
        if (data) {
            const eventDate = new Date(data.getEventItem.activityDate)
            const timeDiff = eventDate.getTime() - currentDate.getTime()
            const dayDiff = timeDiff / (1000 * 3600 * 24)
            setDateDiff(dayDiff)
        }
    }, [data])

    const apiKey = process.env.REACT_APP_OPENWEATHER_KEY
    const locationUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='

    useEffect(() => {
        if (data) {
            if (getCoordinatesData) {
                if (!getCoordinatesData.getCoordinates.activityCoordinates && !getCoordinatesData.getCoordinates.activityApiCityNotFound) {
                    axios
                        .get(`${locationUrl}${data.getEventItem.activityLocation}&limit=1&appid=${apiKey}`)
                        .then(response => {
                            const obj = response.data[0]
                            if (obj) {
                                const coordinates = `${obj.lat},${obj.lon}`
                                setCoordinates({
                                    variables: {
                                        _id: eventId,
                                        activityCoordinates: coordinates,
                                    }
                                })
                            } else {
                                setCoordinates({
                                    variables: {
                                        _id: eventId,
                                        activityApiCityNotFound: true,
                                    }
                                })
                            }
                        })
                }
            }
        }
    }, [getCoordinatesData])

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return JSON.stringify(error, null, 2)

    if (dateDiff > 7 && !data.getEventItem.activityApiCityNotFound) {
        return (
            <div className="mb-16">
                <div className="relative shadow-md border rounded-lg max-w-xs bg-gray-800 border-gray-700 mx-8 font-['Mulish'] cursor-pointer" onClick={() => setClicked(true)}>
                    <img className="rounded-t-lg h-[212px] w-full" src={data.getEventItem.activityImageUrl} />
                    {
                        data.getEventItem.userJoined 
                            ?  <JoinedBadge />
                            : null
                    }
                    {
                        data.getEventItem.updated
                            ? <UpdateBadge />
                            : null
                    }
                    {
                        data.getEventItem.newComment
                            ? <NewCommentBadge />
                            : null
                    }
                    <h5 className="ml-4 mt-2 font-bold text-2xl mb-2 text-white">
                        {data.getEventItem.activityName}
                    </h5>
                    <p className="ml-4 font-normal mb-3 text-gray-400">
                        {data.getEventItem.activityLocation}
                    </p>
                    <p className="ml-4 font-normal mb-3 text-gray-400">
                        {getDate(data.getEventItem.activityDate)}
                    </p>
                    <p className="text-sm w-24 text-center text-gray-400 absolute right-2 top-3/4">
                        No weather forecast available yet
                    </p>
                </div>
                <UpdateEvent
                    clicked={clicked}
                    setClicked={setClicked}
                    id={eventId}
                    item={data.getEventItem}
                    refetchEvents={refetch()}
                />
            </div>
        )
    } else if (dateDiff < -1 && !data.getEventItem.activityApiCityNotFound) {
        return (
            <div className="mb-16">
                <div className="relative shadow-md border rounded-lg max-w-xs bg-gray-800 border-gray-700 mx-8 font-['Mulish'] cursor-pointer opacity-70" onClick={() => setClicked(true)}>
                    <img className="rounded-t-lg h-[212px] w-full" src={data.getEventItem.activityImageUrl} />
                    {
                        data.getEventItem.userJoined 
                            ?  <JoinedBadge />
                            : null
                    }
                    {
                        data.getEventItem.updated
                            ? <UpdateBadge />
                            : null
                    }
                    {
                        data.getEventItem.newComment
                            ? <NewCommentBadge />
                            : null
                    }
                    <h5 className="ml-4 mt-2 font-bold text-2xl mb-2 text-white">
                        {data.getEventItem.activityName}
                    </h5>
                    <p className="ml-4 font-normal mb-3 text-gray-400">
                        {data.getEventItem.activityLocation}
                    </p>
                    <p className="ml-4 font-normal mb-3 text-gray-400">
                        {getDate(data.getEventItem.activityDate)}
                    </p>
                    <div className="text-sm w-24 text-center text-gray-400 absolute right-2 top-3/4">
                        <div className="-mt-5">
                            <img className="w-20" src={getWeatherData ? getWeatherData.getWeather.activityWeatherIcon : null} />
                            <p className="-mt-5 -ml-2">{getWeatherData ? getWeatherData.getWeather.activityWeatherTemp : null}</p>
                        </div>
                    </div>
                </div>
                <UpdateEvent
                    clicked={clicked}
                    setClicked={setClicked}
                    id={eventId}
                    item={data.getEventItem}
                    refetchEvents={refetch()}
                />
            </div>
        )
    } else if (data.getEventItem.activityApiCityNotFound) {
        return (
            <div className="mb-16">
                <div className="relative shadow-md border rounded-lg max-w-xs bg-gray-800 border-gray-700 mx-8 font-['Mulish'] cursor-pointer" onClick={() => setClicked(true)}>
                    <img className="rounded-t-lg h-[212px] w-full" src={data.getEventItem.activityImageUrl} />
                    {
                        data.getEventItem.userJoined 
                            ?  <JoinedBadge />
                            : null
                    }
                    {
                        data.getEventItem.updated
                            ? <UpdateBadge />
                            : null
                    }
                    {
                        data.getEventItem.newComment
                            ? <NewCommentBadge />
                            : null
                    }
                    <h5 className="ml-4 mt-2 font-bold text-2xl mb-2 text-white">
                        {data.getEventItem.activityName}
                    </h5>
                    <p className="ml-4 font-normal mb-3 text-gray-400">
                        {data.getEventItem.activityLocation}
                    </p>
                    <p className="ml-4 font-normal mb-3 text-gray-400">
                        {getDate(data.getEventItem.activityDate)}
                    </p>
                    <p className="text-sm w-24 text-center text-gray-400 absolute right-2 top-3/4">
                        No weather forecast - city not found
                    </p>
                </div>
                <UpdateEvent
                    clicked={clicked}
                    setClicked={setClicked}
                    id={eventId}
                    item={data.getEventItem}
                    refetchEvents={refetch()}
                />
            </div>
        )
    } else {
        return (
            <div className="mb-16">
                <div className="relative shadow-md border rounded-lg max-w-xs bg-gray-800 border-gray-700 mx-8 font-['Mulish'] cursor-pointer" onClick={() => setClicked(true)}>
                    <img className="rounded-t-lg h-[212px] w-full" src={data.getEventItem.activityImageUrl} />
                    {
                        data.getEventItem.userJoined 
                            ?  <JoinedBadge />
                            : null
                    }
                    {
                        data.getEventItem.updated
                            ? <UpdateBadge />
                            : null
                    }
                    {
                        data.getEventItem.newComment
                            ? <NewCommentBadge />
                            : null
                    }
                    <h5 className="ml-4 mt-2 font-bold text-2xl mb-2 text-white">
                        {data.getEventItem.activityName}
                    </h5>
                    <p className="ml-4 text-base font-normal mb-3 text-gray-400">
                        {data.getEventItem.activityLocation}
                    </p>
                    <p className="ml-4 text-base font-normal mb-3 text-gray-400">
                        {getDate(data.getEventItem.activityDate)}
                    </p>
                    <div className="text-sm w-24 text-center text-gray-400 absolute right-2 top-3/4">
                        <Weather 
                            id={eventId}
                            dateDiff={dateDiff} 
                            coordinates={getCoordinatesData ? getCoordinatesData.getCoordinates.activityCoordinates : null}
                            lastCall={getWeatherData ? getWeatherData.getWeather.activityApiLastCall : null}
                            savedIcon={getWeatherData ? getWeatherData.getWeather.activityWeatherIcon : null}
                            savedTemp={getWeatherData ? getWeatherData.getWeather.activityWeatherTemp : null}
                        />
                    </div>
                </div>
                <UpdateEvent
                    clicked={clicked}
                    setClicked={setClicked}
                    id={eventId}
                    item={data ? data.getEventItem : null}
                    weather={getWeatherData ? getWeatherData.getWeather : null}
                    refetchEvents={refetch()}
                />
            </div>
        )
    }
}

export default EventItemTeaser