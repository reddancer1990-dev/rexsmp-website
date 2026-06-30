import { useCallback, useEffect, useRef, useState } from 'react'
import { BacklinksPanel } from './components/BacklinksPanel'
import { Editor } from './components/Editor'
import { GraphView } from './components/GraphView'
import { MobileNav } from './components/MobileNav'
import { Preview } from './components/Preview'
import { SearchModal } from './components/SearchModal'
import { Sidebar } from './components/Sidebar'
import { useVault } from './hooks/useVault'
import type { MobileView } from './types'
import './styles/global.css'

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

function App() {
  const vault = useVault()
  const isDesktop = useIsDesktop()
  const [mobileView, setMobileView] = useState<MobileView>('edit')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopPane, setDesktopPane] = useState<'edit' | 'preview' | 'split'>('split')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const showSidebar = isDesktop || sidebarOpen

  const handleContentChange = useCallback(
    (content: string) => {
      if (!vault.activeNoteId) return
      const id = vault.activeNoteId
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        vault.updateNoteContent(id, content)
      }, 300)
    },
    [vault],
  )

  const handleTitleChange = useCallback(
    (title: string) => {
      if (!vault.activeNoteId) return
      vault.renameNoteById(vault.activeNoteId, title)
    },
    [vault],
  )

  const handleMobileNav = useCallback((view: MobileView) => {
    if (view === 'files') {
      setSidebarOpen(true)
      return
    }
    if (view === 'search') {
      setSearchOpen(true)
      return
    }
    setMobileView(view)
  }, [])

  const handleWikiLink = useCallback(
    async (title: string) => {
      await vault.openNoteByTitle(title)
      if (isDesktop) setDesktopPane('preview')
      else setMobileView('preview')
    },
    [vault, isDesktop],
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
    a.download = `vault-export-${new Date().toISOString().slice(0, 10)}.json`
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

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  if (vault.loading) {
    return (
      <div className="app loading-screen">
        <div className="loader">Loading vault…</div>
      </div>
    )
  }

  const note = vault.activeNote

  const sidebar = (
    <Sidebar
      notes={vault.notes}
      folders={vault.folders}
      activeNoteId={vault.activeNoteId}
      onSelectNote={(id) => {
        vault.setActiveNoteId(id)
        if (!isDesktop) {
          setMobileView('edit')
          setSidebarOpen(false)
        }
      }}
      onCreateNote={() => vault.addNote()}
      onCreateFolder={() => {
        const name = prompt('Folder name')
        if (name) vault.addFolder(name)
      }}
      onDeleteNote={vault.removeNote}
      onClose={() => setSidebarOpen(false)}
    />
  )

  return (
    <div className={`app ${isDesktop ? 'desktop' : 'mobile'}`}>
      {showSidebar && !isDesktop && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      {showSidebar && (
        <div className={isDesktop ? 'sidebar-desktop' : 'sidebar-mobile'}>{sidebar}</div>
      )}

      <div className="app-body">
        <header className="top-bar">
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open files"
          >
            ☰
          </button>
          <h1 className="top-title">{note?.title ?? 'Vault Notes'}</h1>
          <div className="top-actions">
            {isDesktop && (
              <div className="desktop-tabs">
                <button
                  type="button"
                  className={desktopPane === 'edit' ? 'active' : ''}
                  onClick={() => setDesktopPane('edit')}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={desktopPane === 'split' ? 'active' : ''}
                  onClick={() => setDesktopPane('split')}
                >
                  Split
                </button>
                <button
                  type="button"
                  className={desktopPane === 'preview' ? 'active' : ''}
                  onClick={() => setDesktopPane('preview')}
                >
                  Preview
                </button>
                <button type="button" onClick={() => setSearchOpen(true)}>
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('graph')}
                  className={mobileView === 'graph' ? 'active' : ''}
                >
                  Graph
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
              <div className="dropdown-menu">
                <button type="button" onClick={() => vault.addNote()}>
                  New note
                </button>
                <button type="button" onClick={handleExport}>
                  Export vault
                </button>
                <button type="button" onClick={() => importRef.current?.click()}>
                  Import vault
                </button>
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

        <main className="main-content">
          {(isDesktop && mobileView === 'graph') || (!isDesktop && mobileView === 'graph') ? (
            <GraphView
              notes={vault.notes}
              activeNoteId={vault.activeNoteId}
              onSelectNote={(id) => {
                vault.setActiveNoteId(id)
                if (isDesktop) {
                  setMobileView('edit')
                  setDesktopPane('split')
                } else setMobileView('preview')
              }}
            />
          ) : note ? (
            <div
              className={`note-panes ${isDesktop ? `desktop-${desktopPane}` : `mobile-${mobileView}`}`}
            >
              {(!isDesktop ? mobileView === 'edit' : desktopPane !== 'preview') && (
                <Editor
                  content={note.content}
                  title={note.title}
                  onChange={handleContentChange}
                  onTitleChange={handleTitleChange}
                />
              )}
              {(!isDesktop ? mobileView === 'preview' : desktopPane !== 'edit') && (
                <>
                  <Preview
                    content={note.content}
                    onWikiLinkClick={handleWikiLink}
                    onTagClick={handleTagClick}
                  />
                  <BacklinksPanel
                    notes={vault.notes}
                    currentNote={note}
                    onOpenNote={(id) => vault.setActiveNoteId(id)}
                    onTagClick={handleTagClick}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>No note selected</p>
              <button type="button" className="action-btn" onClick={() => vault.addNote()}>
                Create a note
              </button>
            </div>
          )}
        </main>

        {!isDesktop && <MobileNav active={mobileView} onChange={handleMobileNav} />}
      </div>

      {searchOpen && (
        <SearchModal
          notes={vault.notes}
          initialQuery={searchQuery}
          onSelectNote={(id) => {
            vault.setActiveNoteId(id)
            if (!isDesktop) setMobileView('edit')
            setSearchQuery('')
          }}
          onClose={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
        />
      )}
    </div>
  )
}

export default App
