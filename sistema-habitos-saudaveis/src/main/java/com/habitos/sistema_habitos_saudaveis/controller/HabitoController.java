package com.habitos.sistema_habitos_saudaveis.controller;

import com.habitos.sistema_habitos_saudaveis.model.Habito;
import com.habitos.sistema_habitos_saudaveis.service.HabitoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Indica que esta classe é um controlador REST
@RestController
// Define o caminho base da API para /habitos
@RequestMapping("/habitos")
public class HabitoController {

    // Injeção de Dependência para o Service
    @Autowired
    private HabitoService habitoService;

    // 1. C - Create (POST /habitos)
    @PostMapping
    public ResponseEntity<Habito> criarHabito(@RequestBody Habito habito) {
        Habito novoHabito = habitoService.criarHabito(habito);
        return new ResponseEntity<>(novoHabito, HttpStatus.CREATED); // 201 Created
    }

    // 2. R - Read All (GET /habitos)
    @GetMapping
    public ResponseEntity<List<Habito>> buscarTodos() {
        List<Habito> habitos = habitoService.buscarTodos();
        return ResponseEntity.ok(habitos); // 200 OK
    }

    // 3. R - Read by ID (GET /habitos/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Habito> buscarPorId(@PathVariable Long id) {
        Habito habito = habitoService.buscarPorId(id);
        return ResponseEntity.ok(habito); // 200 OK
    }

    // 4. U - Update (PUT /habitos/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Habito> atualizarHabito(@PathVariable Long id, @RequestBody Habito habito) {
        Habito habitoAtualizado = habitoService.atualizarHabito(id, habito);
        return ResponseEntity.ok(habitoAtualizado); // 200 OK
    }

    // 5. D - Delete (DELETE /habitos/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarHabito(@PathVariable Long id) {
        habitoService.deletarHabito(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
    }
}
//funcionando