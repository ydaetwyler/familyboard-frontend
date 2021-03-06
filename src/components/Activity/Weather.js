import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useMutation } from '@apollo/client'
import { SET_WEATHER } from '../../utils/mutations'

import { getTimeFromUtc } from '../../utils/dateHelpers.js'

const Weather = ({ id, dateDiff, coordinates, lastCall, savedIcon, savedTemp }) => {
    const [currentTime] = useState(new Date())
    const [hoursDiff, setHoursDiff] = useState()
    const [weatherData, setWeatherData] = useState()
    const [icon, setIcon] = useState('')
    const [temp, setTemp] = useState('')
    const [desc, setDesc] = useState('')
    const [sunrise, setSunrise] = useState('')
    const [sunset, setSunset] = useState('')
    const [wind, setWind] = useState('')
    const [setWeather] = useMutation(SET_WEATHER)

    const apiKey = process.env.REACT_APP_OPENWEATHER_KEY
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?'

    // Check if event is today, if yes we use the current weather data and not the next 7 days
    const exclude = (dateDiff < 1) ? 'minutely,hourly,daily,alerts' : 'current,minutely,hourly,alerts'

    // To save requests in the free plan we only call the api after 6h for this event again (weather is saved to DB)
    const hoursDiffCalc = (dateNow, dateStringLastCall) => {
        const dateLastCall = new Date(dateStringLastCall)
        let diff = (dateNow.getTime() - dateLastCall.getTime()) / 1000
        diff /= (60 * 60)
        return Math.abs(Math.round(diff))
    }

    useEffect(() => {
        if (lastCall) {
            setHoursDiff(hoursDiffCalc(currentTime, lastCall))
        } 
    }, [])

    useEffect(() => {
        if (hoursDiff && coordinates) {
            if (hoursDiff >= 6) {
                // lat & lon are stored in a string - transform to array to split it to two variables afterwards
                const coordinatesArr = coordinates.split(',')
                const lat = coordinatesArr[0]
                const lon = coordinatesArr[1]
                axios
                    .get(`${weatherUrl}lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${apiKey}`)
                    .then(response => {
                        if (dateDiff > 1) {
                            setWeatherData(response.data.daily[Math.round(dateDiff)])
                        } else {
                            setWeatherData(response.data.current)
                        }
                    })
            }
        }
        
    }, [hoursDiff, coordinates])

    // Set states with weather data and call mutation in next useEffect
    useEffect(() => {
        if (weatherData) {
            setIcon(`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`)
            setTemp(`${
                (dateDiff > 1)
                    ?   Math.round(parseFloat(weatherData.temp.day))
                    :   Math.round(parseFloat(weatherData.temp))
            } ??C`)
            setDesc(weatherData.weather[0].description)
            setSunrise(`${getTimeFromUtc(weatherData.sunrise)}`)
            setSunset(`${getTimeFromUtc(weatherData.sunset)}`)
            setWind(`${weatherData.wind_speed} m/s`)
        }

    }, [weatherData])

    useEffect(() => {
        if (icon, temp, desc, sunrise, sunset, wind) {
            setWeather({
                variables: {
                    _id: id,
                    activityApiLastCall: currentTime,
                    activityWeatherIcon: icon,
                    activityWeatherTemp: temp,
                    activityWeatherDesc: desc,
                    activityWeatherSunrise: sunrise,
                    activityWeatherSunset: sunset,
                    activityWeatherWind: wind
                }
            })
        }

    }, [icon, temp, desc, sunrise, sunset, wind])

    return (
        <div className="-mt-5">
            <img className="w-20" src={icon ? icon : savedIcon} />
            <p className="-mt-5 -ml-2">{temp ? temp : savedTemp}</p>
        </div>
    )
}

export default Weather