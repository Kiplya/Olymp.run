import { useDispatch } from 'react-redux'

import { AppDispatch } from '../store/index'

const useAppDispatch = () => useDispatch<AppDispatch>()

export default useAppDispatch
