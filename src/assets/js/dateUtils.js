// Intl.supportedValuesOf('timeZone')
function getAllTimeZone() {
    return Intl.supportedValuesOf('timeZone')
}

function todayFullDate(timeZone = 'Asia/Tokyo') {
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: timeZone }))
    let day = makeTwoDigit(date.getDate())
    let month = makeTwoDigit(date.getMonth() + 1)
    let year = date.getFullYear()

    return { year, month, day }
}

function currentTime(timeZone = 'Asia/Tokyo') {
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: timeZone }))
    let hour = makeTwoDigit(date.getHours())
    let minute = makeTwoDigit(date.getMinutes())
    let second = makeTwoDigit(date.getSeconds())

    return { hour, minute, second }
}

function makeTwoDigit(data) {
    return data < 10 ? '0' + data : data
}


function convertTimeStampToTime(timestamp, isSec = false) {
    let date = new Date(isSec ? timestamp : timestamp.seconds * 1000)
    let hours = makeTwoDigit(date.getHours())
    let minutes = makeTwoDigit(date.getMinutes())
    let seconds = makeTwoDigit(date.getSeconds())
    let fullTime = hours + ":" + minutes + ":" + seconds
    return fullTime
}

function convertTimeStampToDate(timestamp, isSec = false) {
    if (timestamp == null) {
        return '-'
    }
    let date = new Date(isSec ? timestamp : timestamp.seconds * 1000)
    let year = date.getFullYear()
    let month = makeTwoDigit(date.getMonth() + 1)
    let day = makeTwoDigit(date.getDate())
    let fullDate = year + "/" + month + "/" + day
    return fullDate
}

export {
    todayFullDate,
    currentTime,
    getAllTimeZone,
    convertTimeStampToDate,
    convertTimeStampToTime
}