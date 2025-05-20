import { useEffect, useState, SetStateAction, Dispatch, JSX } from 'react'
import { toast } from 'react-toastify'

import CommonInput from './CommonInput'
import Loader from './Loader'

import cl from '../styles/search.module.css'

interface CommonSearchProps<T, S> {
  placeholder: string
  limit: number
  result: T[] | null
  setResult: Dispatch<SetStateAction<T[] | null>>
  isEqual: (a: T, b: T) => boolean
  renderItem: (item: T) => JSX.Element
  useSearch: (
    args: S,
    options?: any,
  ) => {
    data?: T[]
    isFetching: boolean
    isError: boolean
  }
}

const CommonSearch = <T, S>({
  result,
  setResult,
  isEqual,
  placeholder,
  useSearch,
  limit,
  renderItem,
}: CommonSearchProps<T, S>) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { data, isFetching, isError } = useSearch({ title: debouncedQuery, limit } as S, { skip: !debouncedQuery })

  const filteredData = data?.filter((item) => !result?.some((resItem) => isEqual(resItem, item)))

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!isError) return
    toast.error('Ошибка поиска')
  }, [isError])

  return (
    <div className={cl.searchDiv}>
      <CommonInput
        placeholder={placeholder}
        type='text'
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />

      {isFetching && (
        <div className={cl.loaderDiv}>
          <Loader />
        </div>
      )}

      {!isFetching && debouncedQuery && filteredData && filteredData.length === 0 && <p>Ничего не найдено</p>}

      {!isFetching && debouncedQuery && filteredData && filteredData.length > 0 && (
        <>
          <p>Результаты:</p>
          <ul>
            {filteredData.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setQuery('')
                  setDebouncedQuery('')
                  result ? setResult((prev) => [...prev!, item]) : setResult([item])
                }}
              >
                {renderItem(item)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default CommonSearch
