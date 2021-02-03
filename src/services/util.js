import moment from 'moment'
import { ToastProgrammatic as Toast } from 'buefy'

//*format date. this function take Date() as instance
export const formatDate = function(date, format) {
  if (!format) {
    format = 'YYYY-MM-DD'
  }

  return moment
    .utc(date)
    .local()
    .format(format)
}

//* this is a function to show toast
//* type can be is-success or is-danger
//* position can be is-top or is-bottom
export const showToast = function(message, type, position) {
  Toast.open({
    message: message,
    type: type,
    duration: 5000,
    position: position != null ? position : 'is-top',
  })
}

export const round = function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export const getLocation = async function() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not available.'))
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        resolve(pos)
      },
      err => {
        reject(err)
      }
    )
  })
}

//* Capitalize first letter in a word
export const capitalizeFirstLetter = function(word) {
  if (word) {
    let splitted = word.toLowerCase().split('')

    //*uppercase
    splitted[0] = splitted[0].toUpperCase()

    return splitted.join('')
  }
  return null
}

/*
 * Count and format actual duration
 * @parameter : actual work duration (in minute) and status (string)
 */
export const formatActualOvertimeDuration = (actualWorkInMinute, status) => {
  if (actualWorkInMinute == null) {
    return '0 hours'
  }

  //* normal work hour in minute (8 hour * 60 minute = 480 minute)
  let normalWorkHourInMinute = 8 * 60

  //* only if the status is accepted, we recognize it as an overtime
  if (status === 'accepted') {
    //* only if actual work duration is more than normal work hou (8 hour = 480 minute)
    if (actualWorkInMinute > normalWorkHourInMinute) {
      //* actual overtime is actual work hour in minute - 480 minute (8 hour)
      let actualOvertimeInMinute = actualWorkInMinute - normalWorkHourInMinute
      return formatMinute(actualOvertimeInMinute)
    }
  }

  return '0 hours'
}

/*
 * this will format duration in minute into X hours Y minutes
 * @parameter : duration in minute (Number), hour Format (string), minuteFormat(string)
 */
export const formatMinute = (durationInMinute, hourFormat, minuteFormat) => {
  let hourF = hourFormat ? hourFormat : 'hours'
  let minuteF = minuteFormat ? minuteFormat : 'minutes'

  if (durationInMinute == null) {
    return null
  }
  if (durationInMinute < 60) {
    return durationInMinute.toString() + ' minutes'
  }
  //*  count hour
  let hour = Math.floor(durationInMinute / 60)
  //* count minute
  let minute = durationInMinute % 60
  return hour.toString() + ' ' + hourF + ' ' + minute.toString() + ' ' + minuteF
}

export const getDuration = (startDate, endDate, unitTime) => {
  let momentStart = moment(startDate)
  // console.log('moment star tis')
  // console.log(momentStart)
  let momentEnd = moment(endDate)
  // console.log('moment end is')
  // console.log(momentEnd)

  let duration = momentEnd.diff(momentStart, unitTime)

  return duration
}
