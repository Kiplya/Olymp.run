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
