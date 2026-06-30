import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatedTitle, AnimatedView } from './components/AnimatedView'
import { BacklinksPanel } from './components/BacklinksPanel'
import { Editor } from './components/Editor'
import { GraphView } from './components/GraphView'
import { IconSearch } from './components/Icons'
import { MobileNav } from './components/MobileNav'
import { Preview } from './components/Preview'
import { SearchModal } from './components/SearchModal'
import { SettingsPanel } from './components/SettingsPanel'
import { Sidebar } from './components/Sidebar'
import { useSettings } from './hooks/useSettings'
import { useVault } from './hooks/useVault'
import type { MobileView } from './types'
import './styles/global.css'

const VIEW_ORDER: MobileView[] = ['edit', 'preview', 'graph']

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return desktop
}

function viewDirection(from: MobileView, to: MobileView): 'forward' | 'back' | 'fade' {
  const a = VIEW_ORDER.indexOf(from)
  const b = VIEW_ORDER.indexOf(to)
  if (a < 0 || b < 0 || a === b) return 'fade'
  return b > a ? 'forward' : 'back'
}

function App() {
  const vault = useVault()
  const { settings, updateSettings, resetSettings } = useSettings()
  const isDesktop = useIsDesktop()
  const [mobileView, setMobileView] = useState<MobileView>('preview')
  const [slideDir, setSlideDir] = useState<'forward' | 'back' | 'fade'>('fade')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarClosing, setSidebarClosing] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopPane, setDesktopPane] = useState<'edit' | 'preview' | 'split'>('split')
  const importRef = useRef<HTMLInputElement>(null)
  const prevView = useRef<MobileView>('preview')

  const showSidebar = isDesktop || sidebarOpen

  const closeSidebar = useCallback(() => {
    if (isDesktop) return
    setSidebarClosing(true)
    setTimeout(() => {
      setSidebarOpen(false)
      setSidebarClosing(false)
    }, 320)
  }, [isDesktop])

  const openSidebar = useCallback(() => {
    setSidebarClosing(false)
    setSidebarOpen(true)
  }, [])

  const navigateView = useCallback(
    (view: MobileView) => {
      if (view === 'files') {
        openSidebar()
        return
      }
      if (view === 'search') {
        setSearchOpen(true)
        return
      }
      if (view === 'settings') {
        setSettingsOpen(true)
        return
      }
      setSlideDir(viewDirection(prevView.current, view))
      prevView.current = view
      setMobileView(view)
      closeSidebar()
    },
    [closeSidebar, openSidebar],
  )

  const handleWikiLink = useCallback(
    async (title: string) => {
      await vault.openNoteByTitle(title)
      if (isDesktop) setDesktopPane('preview')
      else navigateView('preview')
    },
    [vault, isDesktop, navigateView],
  )

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(`#${tag}`)
    setSearchOpen(true)
  }, [])

  const handleExport = useCallback(async () => {
    const data = await vault.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rexnotes-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMenuOpen(false)
  }, [vault])

  const handleImport = useCallback(
    async (file: File) => {
      const text = await file.text()
      try {
        await vault.importData(text)
        setMenuOpen(false)
        alert('Vault imported successfully!')
      } catch {
        alert('Could not import vault. Check the file format.')
      }
    },
    [vault],
  )

  const selectNote = useCallback(
    (id: string, openPreview = !isDesktop) => {
      vault.setActiveNoteId(id)
      if (openPreview && !isDesktop) navigateView('preview')
    },
    [vault, isDesktop, navigateView],
  )

  if (vault.loading) {
    return (
      <div className="app loading-screen">
        <div className="loader-ring" aria-hidden />
        <div className="loader">Opening RexNotes…</div>
      </div>
    )
  }

  const note = vault.activeNote
  const navHighlight: MobileView = settingsOpen
    ? 'settings'
    : searchOpen
      ? 'search'
      : sidebarOpen
        ? 'files'
        : mobileView

  return (
    <div className={`app ${isDesktop ? 'desktop' : 'mobile'} ${mobileView === 'graph' && !isDesktop ? 'graph-mode' : ''}`}>
      {showSidebar && !isDesktop && (
        <div className={`sidebar-backdrop ${sidebarClosing ? 'closing' : ''}`} onClick={closeSidebar} />
      )}
      {showSidebar && (
        <div className={`${isDesktop ? 'sidebar-desktop' : 'sidebar-mobile'} ${sidebarClosing ? 'closing' : ''}`}>
          <Sidebar
            notes={vault.notes}
            folders={vault.folders}
            activeNoteId={vault.activeNoteId}
            onSelectNote={(id) => selectNote(id, true)}
            onCreateNote={() => vault.addNote()}
            onCreateFolder={() => {
              const name = prompt('Folder name')
              if (name) vault.addFolder(name)
            }}
            onDeleteNote={vault.removeNote}
            onClose={closeSidebar}
          />
        </div>
      )}

      <div className="app-body">
        <header className="top-bar">
          <button type="button" className="icon-btn menu-btn" onClick={openSidebar} aria-label="Open files">
            ☰
          </button>
          <AnimatedTitle title={note?.title ?? 'RexNotes'} />
          <div className="top-actions">
            <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <IconSearch className="nav-svg" />
            </button>
            {isDesktop && (
              <div className="desktop-tabs">
                {(['edit', 'split', 'preview'] as const).map((pane) => (
                  <button
                    key={pane}
                    type="button"
                    className={desktopPane === pane ? 'active' : ''}
                    onClick={() => setDesktopPane(pane)}
                  >
                    {pane.charAt(0).toUpperCase() + pane.slice(1)}
                  </button>
                ))}
                <button type="button" onClick={() => navigateView('graph')} className={mobileView === 'graph' ? 'active' : ''}>
                  Graph
                </button>
                <button type="button" onClick={() => setSettingsOpen(true)}>
                  Settings
                </button>
              </div>
            )}
            <button type="button" className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              ⋯
            </button>
          </div>
          {menuOpen && (
            <>
              <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
              <div className="dropdown-menu anim-scale-in">
                <button type="button" onClick={() => { vault.addNote(); setMenuOpen(false) }}>
                  New note
                </button>
                <button type="button" onClick={() => { setSettingsOpen(true); setMenuOpen(false) }}>
                  Settings
                </button>
                <button type="button" onClick={handleExport}>Export vault</button>
                <button type="button" onClick={() => importRef.current?.click()}>Import vault</button>
                <input
                  ref={importRef}
                  type="file"
                  accept="application/json,.json"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImport(file)
                    e.target.value = ''
                  }}
                />
              </div>
            </>
          )}
        </header>

        <main className={`main-content ${mobileView === 'graph' ? 'graph-active' : ''}`}>
          {mobileView === 'graph' ? (
            <AnimatedView viewKey={`graph-${vault.activeNoteId}`} direction="fade">
              <GraphView
                notes={vault.notes}
                activeNoteId={vault.activeNoteId}
                settings={settings}
                onSelectNote={(id) => {
                  selectNote(id, true)
                  if (isDesktop) setDesktopPane('split')
                }}
              />
            </AnimatedView>
          ) : note ? (
            <div className={`note-panes ${isDesktop ? `desktop-${desktopPane}` : `mobile-${mobileView}`}`}>
              {(!isDesktop ? mobileView === 'edit' : desktopPane !== 'preview') && (
                <AnimatedView viewKey={`edit-${note.id}`} direction={slideDir}>
                  <Editor
                    noteId={note.id}
                    initialContent={note.content}
                    initialTitle={note.title}
                    readOnly={!!note.locked}
                    onSave={(c) => vault.updateNoteContent(note.id, c)}
                    onTitleSave={(t) => vault.updateNoteTitle(note.id, t)}
                  />
                </AnimatedView>
              )}
              {(!isDesktop ? mobileView === 'preview' : desktopPane !== 'edit') && (
                <AnimatedView viewKey={`preview-${note.id}`} direction={slideDir}>
                  <Preview content={note.content} onWikiLinkClick={handleWikiLink} onTagClick={handleTagClick} />
                  <BacklinksPanel
                    notes={vault.notes}
                    currentNote={note}
                    onOpenNote={(id) => selectNote(id, true)}
                    onTagClick={handleTagClick}
                  />
                </AnimatedView>
              )}
            </div>
          ) : (
            <div className="empty-state anim-fade-in">
              <p>No note selected</p>
              <button type="button" className="action-btn" onClick={() => vault.addNote()}>
                Create a note
              </button>
            </div>
          )}
        </main>
      </div>

      {!isDesktop && <MobileNav highlighted={navHighlight} onChange={navigateView} />}

      {searchOpen && (
        <SearchModal
          notes={vault.notes}
          initialQuery={searchQuery}
          onSelectNote={(id) => selectNote(id, true)}
          onClose={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onReset={resetSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
