package com.example.demo.service;

import com.example.demo.entity.Note;
import com.example.demo.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    // Spring injects NoteRepository automatically
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    // Get all notes
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    // Get one note by id
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    // Create new note
    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    // Update existing note
    public Optional<Note> updateNote(Long id, Note updatedNote) {
        return noteRepository.findById(id).map(existing -> {
            existing.setTitle(updatedNote.getTitle());
            existing.setContent(updatedNote.getContent());
            return noteRepository.save(existing);
        });
    }

    // Delete a note
    public boolean deleteNote(Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Search notes by keyword (checks title AND content)
    public List<Note> searchNotes(String keyword) {
        List<Note> byTitle   = noteRepository.findByTitleContainingIgnoreCase(keyword);
        List<Note> byContent = noteRepository.findByContentContainingIgnoreCase(keyword);

        // Merge results, avoid duplicates
        List<Note> results = new ArrayList<>(byTitle);
        for (Note note : byContent) {
            if (results.stream().noneMatch(n -> n.getId().equals(note.getId()))) {
                results.add(note);
            }
        }
        return results;
    }
}