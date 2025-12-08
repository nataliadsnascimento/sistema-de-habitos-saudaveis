package com.habitos.sistema_habitos_saudaveis.controller;

import com.habitos.sistema_habitos_saudaveis.model.Dieta;
import com.habitos.sistema_habitos_saudaveis.service.DietaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dietas")
public class DietaController {

    @Autowired
    private DietaService dietaService;

    @PostMapping
    public ResponseEntity<Dieta> criar(@RequestBody Dieta dieta) {
        return new ResponseEntity<>(dietaService.criarDieta(dieta), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Dieta>> listar() {
        return ResponseEntity.ok(dietaService.buscarTodas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dieta> atualizar(@PathVariable Long id, @RequestBody Dieta dieta) {
        Dieta dietaAtualizada = dietaService.atualizarDieta(id, dieta);
        return ResponseEntity.ok(dietaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        dietaService.deletarDieta(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
