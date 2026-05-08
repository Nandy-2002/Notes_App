package com.example.demo.controller;

import com.example.demo.entity.Note;
import com.example.demo.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // Allow React frontend to call this API
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // GET /api/notes/  → get all notes
    @GetMapping("/")
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }

    // GET /api/notes/1  → get one note
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/notes/  → create note
    @PostMapping("/")
    public Note createNote(@RequestBody Note note) {
        return noteService.createNote(note);
    }

    // PUT /api/notes/1  → update note
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note note) {
        return noteService.updateNote(id, note)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/notes/1  → delete note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        if (noteService.deleteNote(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // GET /api/notes/search?q=docker  → search notes
    @GetMapping("/search")
    public List<Note> searchNotes(@RequestParam String q) {
        return noteService.searchNotes(q);
    }
}