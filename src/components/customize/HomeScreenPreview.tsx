import { HOME_SCREEN_ICONS } from '../../lib/iconPack'
import { renderDarkIconPreviewDataUrl } from '../../lib/darkIconArt'
import { WALLPAPER_PREVIEW_CLASS } from '../../lib/wallpapers'
import type { CustomizeState } from '../../lib/customize'

interface HomeScreenPreviewProps {
  state: CustomizeState
}

export function HomeScreenPreview({ state }: HomeScreenPreviewProps) {
  const wallpaperClass = WALLPAPER_PREVIEW_CLASS[state.wallpaperId]

  return (
    <div className="home-screen">
      <div className={`home-screen-bg ${wallpaperClass}`} aria-hidden />
      <div className="home-screen-icons">
        {HOME_SCREEN_ICONS.map((icon) => (
          <div key={icon.id} className="home-icon-slot">
            <img
              className="home-icon-img"
              src={renderDarkIconPreviewDataUrl(icon.id, 128)}
              alt=""
            />
            <span className="home-icon-label">{icon.name}</span>
          </div>
        ))}
      </div>
      <div className="home-dock">
        {HOME_SCREEN_ICONS.slice(0, 4).map((icon) => (
          <img
            key={icon.id}
            className="home-icon-img home-icon-img--dock"
            src={renderDarkIconPreviewDataUrl(icon.id, 128)}
            alt=""
          />
        ))}
      </div>
      <div className="home-page-dots" aria-hidden>
        <span className="active" />
        <span />
      </div>
    </div>
  )
}
