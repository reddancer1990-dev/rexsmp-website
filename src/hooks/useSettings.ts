import { useCallback, useEffect, useState } from 'react'
import type { AppSettings } from '../lib/settings'
import { applySettings, DEFAULT_SETTINGS, loadSettings, saveSettings } from '../lib/settings'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())

  useEffect(() => {
    applySettings(settings)
  }, [settings])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS)
    setSettings({ ...DEFAULT_SETTINGS })
  }, [])

  return { settings, updateSettings, resetSettings }
}
