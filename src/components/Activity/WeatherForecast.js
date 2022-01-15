import React from 'react'

const WeatherForecast = ({ weather }) => {

    if (!weather) return null

    return (
        <div>
            <h4 className="block text-xl font-medium text-gray-300">Weather forecast</h4>
            <div className="flex flex-row flex-nowrap w-full">
                <div className="flex flex-col w-1/2 items-center">
                    <img className="-mt-3 w-26" src={weather ? weather.activityWeatherIcon : null} />
                    <p className="-mt-7 text-white text-base font-light">
                        {weather ? weather.activityWeatherDesc : null}
                    </p>
                    <p className="mt-1 text-white text-base font-medium">
                        {weather ? weather.activityWeatherTemp : null}
                    </p>
                    <p className="text-white text-base font-light">
                        {weather ? weather.activityWeatherWind : null}
                    </p>
                </div>
                <div className="pl-6 pt-6 flex flex-col w-1/2 items-start">
                    <div className="flex flex-row flex-nowrap items-baseline mb-5">
                        <img src="/icons/sunrise.png" className="w-10 mr-4" />
                        <p className="text-white text-base font-light">
                            {weather ? weather.activityWeatherSunrise : null}
                        </p>
                    </div>
                    <div className="flex flex-row flex-nowrap items-baseline">
                        <img src="/icons/sunset.png" className="w-10 mr-4" />
                        <p className="text-white text-base font-light">
                            {weather ? weather.activityWeatherSunset : null}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherForecast