import { FC, ReactNode } from 'react'

import cl from '../styles/pageLayout.module.css'

interface PageLayoutProps {
  children: ReactNode
}

const PageLayout: FC<PageLayoutProps> = ({ children }) => <div className={cl.pageLayout}>{children}</div>

export default PageLayout
