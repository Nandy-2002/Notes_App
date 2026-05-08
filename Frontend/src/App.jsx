import React, { useState, useEffect, useCallback } from 'react'
import NoteCard from './components/NoteCard.jsx'
import NoteEditor from './components/NoteEditor.jsx'
import { notesApi } from './api.js'
import styles from './App.module.css'

// ── Demo notes shown when backend isn't running yet ──
const DEMO_NOTES = [
  { id: 1, title: 'Welcome!', content: 'Backend not connected yet — this is demo mode.\n\nBuild the Spring Boot backend next, then these become real.', createdAt: new Date().toISOString() },
  { id: 2, title: 'Docker plan', content: '1. React frontend  ✓\n2. Spring Boot backend  ← next\n3. MySQL database\n4. docker-compose.yml  ← wires it all', createdAt: new Date().toISOString() },
  { id: 3, title: 'Spring Boot checklist', content: '☐ Note.java (entity)\n☐ NoteRepository.java\n☐ NoteService.java\n☐ NoteController.java\n☐ application.yml (MySQL config)', createdAt: new Date().toISOString() },
]

export default function App() {
  const [notes,         setNotes]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [demoMode,      setDemoMode]      = useState(false)
  const [selectedNote,  setSelectedNote]  = useState(null)
  const [editorOpen,    setEditorOpen]    = useState(false)
  const [search,        setSearch]        = useState('')
  const [searchResults, setSearchResults] = useState(null)

  // ── Fetch all notes ──
  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await notesApi.getAll()
      setNotes(res.data)
      setDemoMode(false)
    } catch {
      setNotes(DEMO_NOTES)
      setDemoMode(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  // ── Search (debounced) ──
  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return }
    const t = setTimeout(async () => {
      try {
        const res = await notesApi.search(search)
        setSearchResults(res.data)
      } catch {
        const q = search.toLowerCase()
        setSearchResults(notes.filter(n =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q)
        ))
      }
    }, 300)
    return () => clearTimeout(t)
  }, [search, notes])

  const displayed = searchResults ?? notes

  // ── Handlers ──
  const openNew  = () => { setSelectedNote(null); setEditorOpen(true) }
  const openEdit = (note) => { setSelectedNote(note); setEditorOpen(true) }
  const closeEditor = () => setEditorOpen(false)

  const handleSave = async (noteData) => {
    if (demoMode) { alert('Connect Spring Boot backend to save real notes.'); return }
    try {
      if (noteData.id) {
        const res = await notesApi.update(noteData.id, noteData)
        setNotes(prev => prev.map(n => n.id === noteData.id ? res.data : n))
      } else {
        const res = await notesApi.create(noteData)
        setNotes(prev => [res.data, ...prev])
      }
      setEditorOpen(false)
    } catch {
      alert('Save failed — check backend.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return
    if (demoMode) { setNotes(prev => prev.filter(n => n.id !== id)); return }
    try {
      await notesApi.delete(id)
      setNotes(prev => prev.filter(n => n.id !== id))
      if (selectedNote?.id === id) setEditorOpen(false)
    } catch {
      alert('Delete failed — check backend.')
    }
  }

  return (
    <div className={styles.app}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span className={styles.logo}>✦</span>
            <span className={styles.appName}>Notes</span>
          </div>
          <button className={styles.newBtn} onClick={openNew}>+ New</button>
        </div>

        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.meta}>
          <span>{displayed.length} {searchResults ? 'results' : 'notes'}</span>
          {demoMode && <span className={styles.demoTag}>demo mode</span>}
        </div>

        <div className={styles.list}>
          {loading ? (
            <p className={styles.hint}>Loading…</p>
          ) : displayed.length === 0 ? (
            <p className={styles.hint}>{search ? 'No results.' : 'No notes yet.'}</p>
          ) : (
            displayed.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEdit}
                onDelete={handleDelete}
                isSelected={selectedNote?.id === note.id}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Main panel ── */}
      <main className={styles.main}>
        {editorOpen ? (
          <NoteEditor
            note={selectedNote}
            onSave={handleSave}
            onClose={closeEditor}
          />
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>✦</span>
            <p>Select a note or create a new one</p>
            <button className={styles.emptyBtn} onClick={openNew}>
              Create new note
            </button>
          </div>
        )}
      </main>

    </div>
  )
}