import React, { useState, useEffect } from 'react'
import styles from './NoteEditor.module.css'

export default function NoteEditor({ note, onSave, onClose }) {
  const [title,   setTitle]   = useState('')
  const [content, setContent] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    setTitle(note?.title || '')
    setContent(note?.content || '')
    setSaved(false)
  }, [note])

  const isNew = !note?.id
  const isEmpty = !title.trim() && !content.trim()

  const handleSave = async () => {
    if (isEmpty) return
    setSaving(true)
    try {
      await onSave({ ...note, title: title.trim() || 'Untitled', content })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className={styles.editor} onKeyDown={handleKeyDown}>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={onClose}>← Back</button>
        <span className={styles.label}>{isNew ? 'New note' : 'Editing'}</span>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
          onClick={handleSave}
          disabled={saving || isEmpty}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Writing area */}
      <div className={styles.body}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="Note title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />
        <div className={styles.divider} />
        <textarea
          className={styles.contentInput}
          placeholder="Start writing… (Ctrl+S to save)"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>

      <div className={styles.footer}>
        <span>{content.length} characters</span>
        <span>Ctrl+S to save</span>
      </div>
    </div>
  )
}