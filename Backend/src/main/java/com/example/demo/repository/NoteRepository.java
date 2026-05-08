package com.example.demo.repository;

import com.example.demo.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Spring generates the SQL automatically from the method name!
    // SELECT * FROM notes WHERE title LIKE '%keyword%'
    List<Note> findByTitleContainingIgnoreCase(String keyword);

    // SELECT * FROM notes WHERE content LIKE '%keyword%'
    List<Note> findByContentContainingIgnoreCase(String keyword);
}