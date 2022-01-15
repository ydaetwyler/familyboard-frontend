const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]

export const getDate = isodate => {
    const d = new Date(isodate)

    const year = d.getFullYear()
    const date = d.getDate()
    const monthName = months[d.getMonth()]
    const dayName = days[d.getDay()]
    
    return `${dayName}, ${date} ${monthName} ${year}`
}

export const getShortDate = isodate => {
    const date = new Date(isodate)

    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()

    return `${dd}.${mm}.${yyyy}`
}

export const getExtraShortDate = isodate => {
    const date = new Date(isodate)

    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    const yy = yyyy.toString().substring(2)

    return `${dd}.${mm}.${yy}`
}

export const getTime = isodate => isodate.match(/\d\d:\d\d/)

export const getTimeFromUtc = timestamp => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    return hours + ':' + minutes.substr(-2)
}

export const stringToDate = (string) => {
    let dateString = string
    dateString = dateString.split(".")
    const ISOFormat = new Date(parseInt(dateString[2]),parseInt(dateString[1])-1,parseInt(dateString[0]))

    return ISOFormat.toISOString()  
}