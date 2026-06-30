import { useState } from 'react'
import type { CustomizeState } from '../../lib/customize'
import { HomeScreenPreview } from './HomeScreenPreview'
import { LockScreenPreview } from './LockScreenPreview'

interface PhonePreviewProps {
  state: CustomizeState
}

export function PhonePreview({ state }: PhonePreviewProps) {
  const [screen, setScreen] = useState<'lock' | 'home'>('lock')

  return (
    <div className="phone-preview-wrap">
      <div className="phone-screen-toggle">
        <button
          type="button"
          className={screen === 'lock' ? 'active' : ''}
          onClick={() => setScreen('lock')}
        >
          Lock Screen
        </button>
        <button
          type="button"
          className={screen === 'home' ? 'active' : ''}
          onClick={() => setScreen('home')}
        >
          Home Screen
        </button>
      </div>
      <div className="iphone-frame">
        <div className="iphone-bezel">
          <div className="iphone-island" aria-hidden />
          {screen === 'lock' ? (
            <LockScreenPreview state={state} embedded />
          ) : (
            <div className="iphone-screen iphone-screen--home">
              <HomeScreenPreview state={state} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
