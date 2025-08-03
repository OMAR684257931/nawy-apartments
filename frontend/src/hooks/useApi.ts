import { useState, useEffect, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiOptions {
  retries?: number
  retryDelay?: number
  cache?: boolean
}

export function useApi<T>(
  url: string,
  options: ApiOptions = {}
): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  })

  const { retries = 3, retryDelay = 1000, cache = true } = options

  const fetchData = useCallback(async (attempt = 1): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      setState({
        data: data.data,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error(`API call failed (attempt ${attempt}):`, error)
      
      if (attempt < retries) {
        setTimeout(() => fetchData(attempt + 1), retryDelay * attempt)
      } else {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
      }
    }
  }, [url, retries, retryDelay])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch }
} 