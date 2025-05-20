import { FC, useEffect, useState } from 'react'

import cl from '../styles/scrollToTopButton.module.css'

const ScrollToTopButton: FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    visible && (
      <img
        className={cl.scrollToTopButton}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        src='/img/scrollToTopButton.webp'
        alt=''
      />
    )
  )
}

export default ScrollToTopButton
