import { ResponseStatus } from '@shared/apiTypes'

export const getStatusMessage = (status: number | null) => {
  switch (status) {
    case ResponseStatus.INVALID_CREDENTIALS:
      return 'Неверный логин или пароль'
    case ResponseStatus.INTERNAL_SERVER_ERROR:
      return 'Internal server error'
    default:
      return ''
  }
}
