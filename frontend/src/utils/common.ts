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
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename

  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}
