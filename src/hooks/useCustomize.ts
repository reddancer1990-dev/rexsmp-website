import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_CUSTOMIZE, loadCustomize, saveCustomize, type CustomizeState } from '../lib/customize'

export function useCustomize() {
  const [state, setState] = useState<CustomizeState>(() => loadCustomize())

  useEffect(() => {
    saveCustomize(state)
  }, [state])

  const update = useCallback((patch: Partial<CustomizeState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setState({ ...DEFAULT_CUSTOMIZE })
  }, [])

  return { customize: state, updateCustomize: update, resetCustomize: reset }
}
