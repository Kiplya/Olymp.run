import { useEffect } from 'react'
import { useBlocker } from 'react-router'

const usePrompt = (isShouldBlocked: boolean) => {
  const blocker = useBlocker(isShouldBlocked)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirm = window.confirm('У вас есть несохранённые изменения. Покинуть страницу?')

      if (confirm) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])
}

export default usePrompt
