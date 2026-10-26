package com.example.springreact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Simple in-memory REST API. Replace the map with a Spring Data repository
 * when you add a database.
 */
@RestController
@RequestMapping("/api")
public class TodoController {

    private final Map<Long, Todo> todos = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong();

    public TodoController() {
        add("Learn Spring Boot");
        add("Learn React");
    }

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello from Spring Boot");
    }

    @GetMapping("/todos")
    public Collection<Todo> list() {
        return todos.values().stream()
                .sorted((a, b) -> Long.compare(a.id(), b.id()))
                .toList();
    }

    @PostMapping("/todos")
    @ResponseStatus(HttpStatus.CREATED)
    public Todo create(@Valid @RequestBody TodoRequest request) {
        return add(request.title().trim());
    }

    @PutMapping("/todos/{id}/toggle")
    public ResponseEntity<Todo> toggle(@PathVariable Long id) {
        Todo updated = todos.computeIfPresent(id,
                (k, t) -> new Todo(t.id(), t.title(), !t.done()));
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return todos.remove(id) == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.noContent().build();
    }

    private Todo add(String title) {
        long id = sequence.incrementAndGet();
        Todo todo = new Todo(id, title, false);
        todos.put(id, todo);
        return todo;
    }
}
