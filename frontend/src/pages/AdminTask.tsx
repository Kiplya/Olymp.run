import { FC, useState } from 'react'

import CommonButton from '../components/CommonButton'
import clAdminContest from '../styles/adminContest.module.css'
import clCurrent from '../styles/adminTask.module.css'

const AdminTask: FC = () => {
  return (
    <div className={clAdminContest.adminDiv}>
      <h1>Создание контеста</h1>
      <form onSubmit={() => {}}>
        <CommonButton label='Создать' type='submit' disabled={false} />
      </form>
    </div>
  )
}

export default AdminTask
