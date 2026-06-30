import { HOME_SCREEN_ICONS } from '../../lib/iconPack'
import { WALLPAPER_PREVIEW_CLASS } from '../../lib/wallpapers'
import type { CustomizeState } from '../../lib/customize'

interface HomeScreenPreviewProps {
  state: CustomizeState
}

export function HomeScreenPreview({ state }: HomeScreenPreviewProps) {
  const wallpaperClass = WALLPAPER_PREVIEW_CLASS[state.wallpaperId]
  const iconStyle = state.themePreset === 'black-vision' ? 'black-vision' : 'minimal'

  return (
    <div className="home-screen">
      <div className={`home-screen-bg ${wallpaperClass}`} aria-hidden />
      <div className="home-screen-icons">
        {HOME_SCREEN_ICONS.map((icon) => (
          <div key={icon.id} className="home-icon-slot">
            <span className={`home-icon home-icon--${iconStyle}`}>{icon.glyph}</span>
            <span className="home-icon-label">{icon.name}</span>
          </div>
        ))}
      </div>
      <div className="home-dock">
        {HOME_SCREEN_ICONS.slice(0, 4).map((icon) => (
          <span key={icon.id} className={`home-icon home-icon--${iconStyle}`}>
            {icon.glyph}
          </span>
        ))}
      </div>
      <div className="home-page-dots" aria-hidden>
        <span className="active" />
        <span />
      </div>
    </div>
  )
}
