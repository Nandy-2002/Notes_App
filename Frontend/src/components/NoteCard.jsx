import React from 'react'
import styles from './NoteCard.module.css'

const CARD_COLORS = ['#FFF9C4','#E8F5E9','#E3F2FD','#FCE4EC','#FFF3E0','#EDE7F6']

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export default function NoteCard({ note, onEdit, onDelete, isSelected }) {
  const color = CARD_COLORS[note.id % CARD_COLORS.length]
  const preview = note.content?.length > 110
    ? note.content.slice(0, 110) + '…'
    : note.content

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      style={{ '--card-bg': color }}
      onClick={() => onEdit(note)}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{note.title || 'Untitled'}</h3>
        <button
          className={styles.deleteBtn}
          onClick={e => { e.stopPropagation(); onDelete(note.id) }}
          aria-label="Delete note"
        >×</button>
      </div>

      <p className={styles.preview}>
        {preview || <em>No content</em>}
      </p>

      <span className={styles.date}>
        {formatDate(note.updatedAt || note.createdAt)}
      </span>
    </div>
  )
}