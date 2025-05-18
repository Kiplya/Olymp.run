import { ResponseStatus } from '@shared/apiTypes'

export const getStatusMessage = (status: number | string) => {
  switch (status) {
    case ResponseStatus.INVALID_CREDENTIALS:
      return 'Неверный логин или пароль'
    case ResponseStatus.INTERNAL_SERVER_ERROR:
      return 'Internal server error'
    case 'FETCH_ERROR':
      return 'Ethernet error'
    default:
      return ''
  }
}

export const downloadJsonFile = (filename: string, data: any) => {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename

  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

const plural = (time: number, forms: [string, string, string]) => {
  const mod10 = time % 10
  const mod100 = time % 100

  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

export const getTimeDiffString = (date: string | Date) => {
  const diff = new Date(date).getTime() - new Date().getTime()

  if (diff <= 0) {
    return 0
  }

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (seconds < 60) {
    return `${seconds} ${plural(seconds, ['секунда', 'секунды', 'секунд'])}`
  } else if (minutes < 60) {
    return `${minutes} ${plural(minutes, ['минута', 'минуты', 'минут'])}`
  } else if (hours < 24) {
    return `${hours} ${plural(hours, ['час', 'часа', 'часов'])}`
  } else {
    return `${days} ${plural(days, ['день', 'дня', 'дней'])}`
  }
}
