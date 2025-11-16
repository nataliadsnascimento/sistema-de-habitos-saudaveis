package com.habitos.sistema_habitos_saudaveis.controller;

import com.habitos.sistema_habitos_saudaveis.model.RegistroDiario;
import com.habitos.sistema_habitos_saudaveis.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/registros")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    // 1. CREATE: POST /registros
    @PostMapping
    public ResponseEntity<RegistroDiario> criarRegistro(@RequestBody RegistroDiario registro) {
        RegistroDiario novoRegistro = registroService.criarRegistro(registro);
        return ResponseEntity.ok(novoRegistro);
    }

    // 2. READ: GET /registros?usuarioId={id}&dataInicio={data}&dataFim={data}
    // Este endpoint usa a lógica que seu relatório de evolução usará no futuro!
    @GetMapping
    public ResponseEntity<List<RegistroDiario>> buscarRegistros(
            @RequestParam Long usuarioId,
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim) {

        List<RegistroDiario> registros = registroService.buscarRegistrosPorPeriodo(usuarioId, dataInicio, dataFim);
        return ResponseEntity.ok(registros);
    }

    // 3. READ: GET /registros/{id}
    @GetMapping("/{id}")
    public ResponseEntity<RegistroDiario> buscarRegistroPorId(@PathVariable Long id) {
        RegistroDiario registro = registroService.buscarRegistroPorId(id);
        return ResponseEntity.ok(registro);
    }

    // 4. UPDATE: PUT /registros/{id}
    @PutMapping("/{id}")
    public ResponseEntity<RegistroDiario> atualizarRegistro(
            @PathVariable Long id,
            @RequestBody RegistroDiario detalhesRegistro) {

        RegistroDiario registroAtualizado = registroService.atualizarRegistro(id, detalhesRegistro);
        return ResponseEntity.ok(registroAtualizado);
    }

    // 5. DELETE: DELETE /registros/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRegistro(@PathVariable Long id) {
        registroService.deletarRegistro(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}