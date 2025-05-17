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

export const getTimeDiffString = (date: string | Date) => {
  const diff = new Date(date).getTime() - new Date().getTime()

  if (diff <= 0) {
    return 0
  }

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes} минут`
  } else if (hours < 24) {
    return `${hours} часов`
  } else {
    return `${days} дней`
  }
}
